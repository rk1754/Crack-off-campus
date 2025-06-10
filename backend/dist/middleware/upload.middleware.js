"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
exports.upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit per file
        fieldSize: 10 * 1024 * 1024, // 10MB limit per field
        fieldNameSize: 100, // Default is usually 100 bytes
        fields: 20, // Allow up to 20 non-file fields
        files: 2, // Allow up to 2 files (profile_pic and cover_image)
        parts: 50, // Allow up to 50 total parts in the multipart request
    }
});
