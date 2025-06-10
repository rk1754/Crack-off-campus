"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleLargeRequests = void 0;
const handleLargeRequests = (req, res, next) => {
    // For multipart/form-data requests, increase the body size limits temporarily
    if (req.headers['content-type']?.includes('multipart/form-data')) {
        // Set req.body to undefined to skip express.json/urlencoded parsing
        req.body = undefined;
    }
    next();
};
exports.handleLargeRequests = handleLargeRequests;
