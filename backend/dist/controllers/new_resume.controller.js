"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadCoverLetterTemplate = exports.downloadColdMailTemplate = exports.downloadReferralTemplate = exports.downloadHrEmailTemplate = exports.downloadResumeTemplate = void 0;
const path_1 = __importDefault(require("path"));
// Directory where static templates are stored
const TEMPLATE_DIR = path_1.default.join(__dirname, '../static/templates');
// Subscription types
const SUBSCRIPTION_RESUME = 'resume';
const SUBSCRIPTION_TEMPLATES = 'other_templates';
// Helper to check subscription
function hasSubscription(user, requiredType) {
    if (requiredType == "resume") {
        return (user.subscription_type === "resume" || user.subscription_type === "booster" || user.subscription_type === "standard" || user.subscription_type === "basic");
    }
    else {
        return (user.subscription_type === "other_templates" || user.subscription_type === "booster" || user.subscription_type === "standard" || user.subscription_type === "basic");
    }
}
// Download Resume Template (99 rs, requires 'resume' subscription)
const downloadResumeTemplate = (req, res) => {
    const user = req.user; // Assume user is attached to req
    if (!hasSubscription(user, SUBSCRIPTION_RESUME)) {
        res.status(403).json({ error: 'Resume template requires resume subscription (99 rs).' });
        return;
    }
    const filePath = path_1.default.join(TEMPLATE_DIR, 'resume_template.pdf');
    res.download(filePath, 'resume_template.pdf');
};
exports.downloadResumeTemplate = downloadResumeTemplate;
// Download HR Email Template (49 rs, requires 'templates' subscription)
const downloadHrEmailTemplate = (req, res) => {
    const user = req.user;
    if (!hasSubscription(user, SUBSCRIPTION_TEMPLATES)) {
        res.status(403).json({ error: 'HR email template requires templates subscription (49 rs).' });
        return;
    }
    const filePath = path_1.default.join(TEMPLATE_DIR, 'hr_email_template.pdf');
    res.download(filePath, 'hr_email_template.pdf');
};
exports.downloadHrEmailTemplate = downloadHrEmailTemplate;
// Download Referral Template (49 rs, requires 'templates' subscription)
const downloadReferralTemplate = (req, res) => {
    const user = req.user;
    if (!hasSubscription(user, SUBSCRIPTION_TEMPLATES)) {
        res.status(403).json({ error: 'Referral template requires templates subscription (49 rs).' });
        return;
    }
    const filePath = path_1.default.join(TEMPLATE_DIR, 'referral_template.pdf');
    res.download(filePath, 'referral_template.pdf');
};
exports.downloadReferralTemplate = downloadReferralTemplate;
// Download Cold Mail Template (49 rs, requires 'templates' subscription)
const downloadColdMailTemplate = (req, res) => {
    const user = req.user;
    if (!hasSubscription(user, SUBSCRIPTION_TEMPLATES)) {
        res.status(403).json({ error: 'Cold mail template requires templates subscription (49 rs).' });
        return;
    }
    const filePath = path_1.default.join(TEMPLATE_DIR, 'cold_mail_template.pdf');
    res.download(filePath, 'cold_mail_template.pdf');
};
exports.downloadColdMailTemplate = downloadColdMailTemplate;
// Download Cover Letter Template (49 rs, requires 'templates' subscription)
const downloadCoverLetterTemplate = (req, res) => {
    const user = req.user;
    if (!hasSubscription(user, SUBSCRIPTION_TEMPLATES)) {
        res.status(403).json({ error: 'Cover letter template requires templates subscription (49 rs).' });
        return;
    }
    const filePath = path_1.default.join(TEMPLATE_DIR, 'cover_letter_template.pdf');
    res.download(filePath, 'cover_letter_template.pdf');
};
exports.downloadCoverLetterTemplate = downloadCoverLetterTemplate;
