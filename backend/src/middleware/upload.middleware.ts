import multer from 'multer';

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per file
    fieldSize: 10 * 1024 * 1024, // 10MB limit per field
    fieldNameSize: 100, // Default is usually 100 bytes
    fields: 20, // Allow up to 20 non-file fields
    files: 2, // Allow up to 2 files (profile_pic and cover_image)
    parts: 50, // Allow up to 50 total parts in the multipart request
  }
});