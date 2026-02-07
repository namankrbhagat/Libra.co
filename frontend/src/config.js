
// Use environment variable for API URL in production
// In development, this will be empty, and requests will go to /api (proxied by Vite)
// Ensure no trailing slash
const rawUrl = import.meta.env.VITE_API_URL || "";
export const API_BASE_URL = rawUrl.endsWith('/') ? rawUrl.slice(0, -1) : rawUrl;
