"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
class ResumeUploadController {
    constructor() {
        this.uploadResumeForBooking = async (req, res) => {
            try {
                if (!req.file) {
                    res.status(400).json({
                        success: false,
                        message: "No file uploaded",
                    });
                    return;
                }
                const file = req.file;
                // Validate file type
                const allowedMimeTypes = [
                    'application/pdf',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                ];
                if (!allowedMimeTypes.includes(file.mimetype)) {
                    res.status(400).json({
                        success: false,
                        message: "Invalid file type. Only PDF, DOC, and DOCX files are allowed.",
                    });
                    return;
                }
                // Validate file size (2MB limit)
                if (file.size > 2 * 1024 * 1024) {
                    res.status(400).json({
                        success: false,
                        message: "File size exceeds 2 MB limit",
                    });
                    return;
                }
                const base64 = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
                // Extract file extension from original filename
                const fileExtension = file.originalname.split('.').pop()?.toLowerCase() ||
                    (file.mimetype === 'application/pdf' ? 'pdf' :
                        file.mimetype === 'application/msword' ? 'doc' : 'docx');
                const result = await cloudinary_1.default.uploader.upload(base64, {
                    folder: "job-portal/session-resumes",
                    resource_type: "raw",
                    public_id: `resume_${Date.now()}.${fileExtension}`,
                    format: fileExtension, // Explicitly set the format
                });
                if (!result) {
                    res.status(500).json({
                        success: false,
                        message: "Something went wrong while uploading the file",
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    message: "Resume uploaded successfully",
                    resumeUrl: result.secure_url,
                    publicId: result.public_id,
                });
            }
            catch (err) {
                console.error(err);
                res.status(500).json({
                    success: false,
                    message: "Something went wrong while uploading resume",
                });
            }
        };
        // New method to handle resume downloads with proper headers
        this.downloadResume = async (req, res) => {
            try {
                const { resumeUrl, fileName } = req.query;
                if (!resumeUrl || typeof resumeUrl !== 'string') {
                    res.status(400).json({
                        success: false,
                        message: "Resume URL is required",
                    });
                    return;
                }
                // Extract file extension from URL or filename
                const getExtension = (url, fallbackName) => {
                    const urlExt = url.match(/\.([^.?]+)(\?|$)/);
                    if (urlExt)
                        return urlExt[1].toLowerCase();
                    if (fallbackName && typeof fallbackName === 'string') {
                        const nameExt = fallbackName.match(/\.([^.]+)$/);
                        if (nameExt)
                            return nameExt[1].toLowerCase();
                    }
                    return 'pdf'; // Default to PDF
                };
                const extension = getExtension(resumeUrl, fileName);
                const safeFileName = fileName || `resume.${extension}`;
                // Set appropriate content type based on extension
                const contentTypes = {
                    'pdf': 'application/pdf',
                    'doc': 'application/msword',
                    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                };
                const contentType = contentTypes[extension] || 'application/octet-stream';
                // Set headers for proper download
                res.setHeader('Content-Type', contentType);
                res.setHeader('Content-Disposition', `attachment; filename="${safeFileName}"`);
                res.setHeader('Cache-Control', 'no-cache');
                // Redirect to the actual file URL
                res.redirect(resumeUrl);
            }
            catch (err) {
                console.error("Resume download error:", err);
                res.status(500).json({
                    success: false,
                    message: "Something went wrong while downloading resume",
                });
            }
        };
    }
}
exports.default = ResumeUploadController;
