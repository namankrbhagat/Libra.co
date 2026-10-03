import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.REDIS_URL;

let redisClient = null;

if (redisUrl) {
  try {
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 1, // Fail fast on commands when disconnected so fallback logic triggers
      retryStrategy(times) {
        // Exponential backoff up to 2 seconds
        return Math.min(times * 100, 2000);
      },
      enableOfflineQueue: false // Prevents command queueing while offline
    });

    redisClient.on('connect', () => {
      console.log('[Redis] Connected to Redis server.');
    });

    redisClient.on('ready', () => {
      console.log('[Redis] Client ready to process commands.');
    });

    redisClient.on('error', (err) => {
      console.warn('[Redis Warning] Connection issue:', err.message);
    });

    redisClient.on('end', () => {
      console.warn('[Redis] Connection closed.');
    });
  } catch (error) {
    console.warn('[Redis] Client initialization error:', error.message);
  }
} else {
  console.log('[Redis] REDIS_URL not provided. Redis operations will be safely bypassed.');
}

/**
 * Checks if Redis client is connected and ready.
 */
export const isRedisConnected = () => redisClient?.status === 'ready';

/**
 * Safely executes a Redis command.
 * If Redis is unavailable or throws an error, returns the provided fallback value without throwing.
 */
export const safeRedisCall = async (fn, fallbackValue = null) => {
  if (!redisClient || redisClient.status !== 'ready') return fallbackValue;
  try {
    return await fn(redisClient);
  } catch (err) {
    console.warn('[Redis SafeCall Warning]:', err.message);
    return fallbackValue;
  }
};

/**
 * Set a key with optional TTL (in seconds)
 */
export const setRedisKey = async (key, value, ttlInSeconds = null) => {
  return safeRedisCall(async (client) => {
    const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
    if (ttlInSeconds) {
      return await client.set(key, stringValue, 'EX', ttlInSeconds);
    }
    return await client.set(key, stringValue);
  }, null);
};

/**
 * Get a value by key
 */
export const getRedisKey = async (key) => {
  return safeRedisCall(async (client) => {
    return await client.get(key);
  }, null);
};

/**
 * Delete a key
 */
export const deleteRedisKey = async (key) => {
  return safeRedisCall(async (client) => {
    return await client.del(key);
  }, null);
};

export default redisClient;
