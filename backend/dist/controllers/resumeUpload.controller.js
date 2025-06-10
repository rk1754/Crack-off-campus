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
                const result = await cloudinary_1.default.uploader.upload(base64, {
                    folder: "job-portal/session-resumes",
                    resource_type: "raw",
                    public_id: `resume_${Date.now()}`,
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
    }
}
exports.default = ResumeUploadController;
