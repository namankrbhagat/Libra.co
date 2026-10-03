import { safeRedisCall } from '../lib/redis.js';

/**
 * Creates a rate limiting middleware using Redis atomic counters.
 * If Redis is unavailable, requests pass through gracefully.
 * 
 * @param {Object} options
 * @param {string} options.prefix - Redis key prefix for rate limiting
 * @param {number} options.windowInSeconds - Time window for rate limiting
 * @param {number} options.maxRequests - Max allowed requests per window
 * @param {string} options.message - Error message when rate limit is exceeded
 * @param {Function} [options.keyGenerator] - Custom function to extract identifier from request
 */
export const createRateLimiter = ({
  prefix = 'ratelimit',
  windowInSeconds = 900, // Default 15 minutes
  maxRequests = 10,
  message = 'Too many requests. Please try again later.',
  keyGenerator = null
}) => {
  return async (req, res, next) => {
    try {
      let identifier = '';
      if (keyGenerator) {
        identifier = keyGenerator(req);
      } else if (req.user && (req.user.email || req.user._id)) {
        identifier = req.user.email ? req.user.email.toLowerCase().trim() : req.user._id.toString();
      } else if (req.body && req.body.email) {
        identifier = req.body.email.toLowerCase().trim();
      } else {
        const forwarded = req.headers['x-forwarded-for'];
        const clientIp = typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : req.ip;
        identifier = clientIp || req.socket?.remoteAddress || 'unknown';
      }

      const redisKey = `${prefix}:${identifier}`;

      // Execute Redis increment & TTL check safely
      const result = await safeRedisCall(async (client) => {
        const requests = await client.incr(redisKey);
        if (requests === 1) {
          // Set TTL on key creation
          await client.expire(redisKey, windowInSeconds);
        }
        let ttl = await client.ttl(redisKey);
        // Fallback safety: If key somehow lost TTL (-1), set it now
        if (ttl === -1) {
          await client.expire(redisKey, windowInSeconds);
          ttl = windowInSeconds;
        }
        return { requests, ttl };
      }, null);

      // If Redis is down or unavailable, gracefully bypass rate limiter
      if (!result) {
        return next();
      }

      const { requests, ttl } = result;

      // Attach standard rate limit headers
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - requests));
      res.setHeader('X-RateLimit-Reset', Math.ceil(Date.now() / 1000) + (ttl > 0 ? ttl : windowInSeconds));

      if (requests > maxRequests) {
        return res.status(429).json({
          message,
          retryAfterSeconds: ttl > 0 ? ttl : windowInSeconds
        });
      }

      next();
    } catch (error) {
      console.warn('[RateLimiter Warning] Error in rate limiter, passing through:', error.message);
      next();
    }
  };
};

/**
 * Rate limiter for sensitive authentication endpoints (Login, Signup, Profile updates)
 * Max 10 attempts per 15 minutes window
 */
export const authRateLimiter = createRateLimiter({
  prefix: 'ratelimit:auth',
  windowInSeconds: 15 * 60, // 15 minutes
  maxRequests: 10,
  message: 'Too many authentication attempts. Please try again after 15 minutes.'
});

/**
 * Rate limiter for OTP sending endpoint
 * Requirement: Maximum 5 OTP requests per hour per email/user
 */
export const otpSendRateLimiter = createRateLimiter({
  prefix: 'ratelimit:otp',
  windowInSeconds: 60 * 60, // 1 hour (3600 seconds)
  maxRequests: 5,
  message: 'Maximum OTP request limit reached (5 per hour). Please try again later.',
  keyGenerator: (req) => {
    if (req.user) {
      return req.user.email ? req.user.email.toLowerCase().trim() : req.user._id.toString();
    }
    const forwarded = req.headers['x-forwarded-for'];
    const clientIp = typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : req.ip;
    return clientIp || 'unknown';
  }
});
