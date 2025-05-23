
// Use relative path in development and absolute in production
const isProduction = process.env.NODE_ENV === 'production';

// Change from localhost to production URL or relative path
export const BACKEND_URL = isProduction 
  ? "/api/v1"
  : "http://localhost:5454/api/v1";
