import { Request, Response, NextFunction } from 'express';

export const handleLargeRequests = (req: Request, res: Response, next: NextFunction) => {
  // For multipart/form-data requests, increase the body size limits temporarily
  if (req.headers['content-type']?.includes('multipart/form-data')) {
    // Set req.body to undefined to skip express.json/urlencoded parsing
    req.body = undefined;
  }
  next();
};
