"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadCoverLetterTemplate = exports.downloadColdMailTemplate = exports.downloadReferralTemplate = exports.downloadHrEmailTemplate = exports.downloadResumeTemplate = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Directory where static templates are stored
const TEMPLATE_DIR = path_1.default.join(__dirname, '../static/templates');
// Subscription types
const SUBSCRIPTION_RESUME = 'resume';
const SUBSCRIPTION_TEMPLATES = 'other_templates';
// Helper to check subscription
function hasSubscription(user, requiredType) {
    if (!user?.subscription_type) {
        return false; // Handle case where user or subscription_type is undefined
    }
    if (requiredType === SUBSCRIPTION_RESUME) {
        return ['resume', 'booster', 'standard', 'basic'].includes(user.subscription_type);
    }
    return ['other_templates', 'booster', 'standard', 'basic'].includes(user.subscription_type);
}
// Download Resume Template
const downloadResumeTemplate = (req, res) => {
    const user = req.user;
    if (!user) {
        res.status(401).json({ error: 'Unauthorized: User not authenticated.' });
        return;
    }
    if (!hasSubscription(user, SUBSCRIPTION_RESUME)) {
        res.status(403).json({ error: 'Resume template requires resume subscription (99 rs).' });
        return;
    }
    const filePath = path_1.default.join(TEMPLATE_DIR, 'resume_template.pdf');
    console.log('File path:', filePath);
    if (!fs_1.default.existsSync(filePath)) {
        res.status(404).json({ error: 'File not found.' });
        return;
    }
    // Set headers for file download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="resume_template.pdf"');
    // Stream the file
    const fileStream = fs_1.default.createReadStream(filePath);
    fileStream.pipe(res).on('error', (err) => {
        console.error('Error streaming file:', err);
        res.status(500).json({ error: 'Failed to download the file.' });
    });
};
exports.downloadResumeTemplate = downloadResumeTemplate;
// Download HR Email Template
const downloadHrEmailTemplate = (req, res) => {
    const user = req.user;
    if (!hasSubscription(user, SUBSCRIPTION_TEMPLATES)) {
        res.status(403).json({ error: 'HR email template requires templates subscription (49 rs).' });
        return;
    }
    const filePath = path_1.default.join(TEMPLATE_DIR, 'hr_email_template.pdf');
    // Check if the file exists
    if (!fs_1.default.existsSync(filePath)) {
        res.status(404).json({ error: 'File not found.' });
        return;
    }
    // Set headers for file download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="hr_email_template.pdf"');
    // Send the file
    res.download(filePath, (err) => {
        if (err) {
            console.error('Error downloading file:', err);
            res.status(500).json({ error: 'Failed to download the file.' });
        }
    });
};
exports.downloadHrEmailTemplate = downloadHrEmailTemplate;
// Download Referral Template
const downloadReferralTemplate = (req, res) => {
    const user = req.user;
    if (!hasSubscription(user, SUBSCRIPTION_TEMPLATES)) {
        res.status(403).json({ error: 'Referral template requires templates subscription (49 rs).' });
        return;
    }
    const filePath = path_1.default.join(TEMPLATE_DIR, 'referral_template.pdf');
    // Check if the file exists
    if (!fs_1.default.existsSync(filePath)) {
        res.status(404).json({ error: 'File not found.' });
        return;
    }
    // Set headers for file download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="referral_template.pdf"');
    // Send the file
    res.download(filePath, (err) => {
        if (err) {
            console.error('Error downloading file:', err);
            res.status(500).json({ error: 'Failed to download the file.' });
        }
    });
};
exports.downloadReferralTemplate = downloadReferralTemplate;
// Download Cold Mail Template
const downloadColdMailTemplate = (req, res) => {
    const user = req.user;
    if (!hasSubscription(user, SUBSCRIPTION_TEMPLATES)) {
        res.status(403).json({ error: 'Cold mail template requires templates subscription (49 rs).' });
        return;
    }
    const filePath = path_1.default.join(TEMPLATE_DIR, 'cold_mail_template.pdf');
    // Check if the file exists
    if (!fs_1.default.existsSync(filePath)) {
        res.status(404).json({ error: 'File not found.' });
        return;
    }
    // Set headers for file download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="cold_mail_template.pdf"');
    // Send the file
    res.download(filePath, (err) => {
        if (err) {
            console.error('Error downloading file:', err);
            res.status(500).json({ error: 'Failed to download the file.' });
        }
    });
};
exports.downloadColdMailTemplate = downloadColdMailTemplate;
// Download Cover Letter Template
const downloadCoverLetterTemplate = (req, res) => {
    const user = req.user;
    if (!hasSubscription(user, SUBSCRIPTION_TEMPLATES)) {
        res.status(403).json({ error: 'Cover letter template requires templates subscription (49 rs).' });
        return;
    }
    const filePath = path_1.default.join(TEMPLATE_DIR, 'cover_letter_template.pdf');
    // Check if the file exists
    if (!fs_1.default.existsSync(filePath)) {
        res.status(404).json({ error: 'File not found.' });
        return;
    }
    // Set headers for file download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="cover_letter_template.pdf"');
    // Send the file
    res.download(filePath, (err) => {
        if (err) {
            console.error('Error downloading file:', err);
            res.status(500).json({ error: 'Failed to download the file.' });
        }
    });
};
exports.downloadCoverLetterTemplate = downloadCoverLetterTemplate;
