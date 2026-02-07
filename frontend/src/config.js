
// Use environment variable for API URL in production
// In development, this will be empty, and requests will go to /api (proxied by Vite)
export const API_BASE_URL = import.meta.env.VITE_API_URL || "";
