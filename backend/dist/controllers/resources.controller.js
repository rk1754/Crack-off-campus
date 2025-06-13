"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const logger_1 = __importDefault(require("../utils/logger"));
class ResourcesController {
    constructor() {
        this.downloadResumeTemplate = async (req, res) => {
            try {
                const user = req.user;
                if (!this.checkResourceAccess(user, 'resume')) {
                    res.status(403).json({
                        success: false,
                        message: "Access denied. Please purchase this resource first."
                    });
                    return;
                }
                this.sendFile(res, "resume_template.pdf", "resume_template.pdf");
            }
            catch (error) {
                logger_1.default.error("Error downloading resume template", {
                    error: error.message,
                    user_id: req.user?.id
                });
                res.status(500).json({
                    success: false,
                    message: "Server error"
                });
            }
        };
        this.downloadReferralTemplate = async (req, res) => {
            try {
                const user = req.user;
                if (!this.checkResourceAccess(user, 'referral')) {
                    res.status(403).json({
                        success: false,
                        message: "Access denied. Please purchase this resource first."
                    });
                    return;
                }
                this.sendFile(res, "referral_template.pdf", "referral_template.pdf");
            }
            catch (error) {
                logger_1.default.error("Error downloading referral template", {
                    error: error.message,
                    user_id: req.user?.id
                });
                res.status(500).json({
                    success: false,
                    message: "Server error"
                });
            }
        };
        this.downloadColdMailTemplate = async (req, res) => {
            try {
                const user = req.user;
                if (!this.checkResourceAccess(user, 'cold_mail')) {
                    res.status(403).json({
                        success: false,
                        message: "Access denied. Please purchase this resource first."
                    });
                    return;
                }
                this.sendFile(res, "cold_mail_template.pdf", "cold_mail_template.pdf");
            }
            catch (error) {
                logger_1.default.error("Error downloading cold mail template", {
                    error: error.message,
                    user_id: req.user?.id
                });
                res.status(500).json({
                    success: false,
                    message: "Server error"
                });
            }
        };
        this.downloadCoverLetterTemplate = async (req, res) => {
            try {
                const user = req.user;
                if (!this.checkResourceAccess(user, 'cover_letter')) {
                    res.status(403).json({
                        success: false,
                        message: "Access denied. Please purchase this resource first."
                    });
                    return;
                }
                this.sendFile(res, "cover_letter_template.pdf", "cover_letter_template.pdf");
            }
            catch (error) {
                logger_1.default.error("Error downloading cover letter template", {
                    error: error.message,
                    user_id: req.user?.id
                });
                res.status(500).json({
                    success: false,
                    message: "Server error"
                });
            }
        };
        this.downloadHrEmailTemplate = async (req, res) => {
            try {
                const user = req.user;
                if (!this.checkResourceAccess(user, 'hr_mail')) {
                    res.status(403).json({
                        success: false,
                        message: "Access denied. Please purchase this resource first."
                    });
                    return;
                }
                this.sendFile(res, "hr_email_template.pdf", "hr_email_template.pdf");
            }
            catch (error) {
                logger_1.default.error("Error downloading HR email template", {
                    error: error.message,
                    user_id: req.user?.id
                });
                res.status(500).json({
                    success: false,
                    message: "Server error"
                });
            }
        };
    }
    // Helper method to check if user has access to a resource
    checkResourceAccess(user, resourceType) {
        if (!user)
            return false;
        // Check if user has the specific resource boolean flag
        return user[resourceType] === true;
    }
    // Helper method to send file
    sendFile(res, filePath, fileName) {
        const absolutePath = path_1.default.join(__dirname, "..", "static", "templates", filePath);
        // Check if file exists
        if (!fs_1.default.existsSync(absolutePath)) {
            logger_1.default.error(`Template file not found: ${absolutePath}`);
            res.status(404).json({
                success: false,
                message: "Template file not found"
            });
            return;
        }
        // Set headers for download
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.setHeader('Content-Type', 'application/pdf');
        // Send file
        res.sendFile(absolutePath, (err) => {
            if (err) {
                logger_1.default.error(`Error sending file: ${err.message}`);
                if (!res.headersSent) {
                    res.status(500).json({
                        success: false,
                        message: "Error downloading file"
                    });
                }
            }
            else {
                logger_1.default.info(`File downloaded successfully: ${fileName}`, {
                    user_id: res.locals.user?.id,
                    resource: fileName
                });
            }
        });
    }
}
exports.default = new ResourcesController();
