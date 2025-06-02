"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const new_resume_controller_1 = require("../controllers/new_resume.controller");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const router = (0, express_1.Router)();
router.get('/download/templates/resume', auth_middleware_1.default, new_resume_controller_1.downloadResumeTemplate);
router.get('/download/templates/hr-email', auth_middleware_1.default, new_resume_controller_1.downloadHrEmailTemplate);
router.get('/download/templates/referral', auth_middleware_1.default, new_resume_controller_1.downloadReferralTemplate);
router.get('/download/templates/cold-mail', auth_middleware_1.default, new_resume_controller_1.downloadColdMailTemplate);
router.get('/download/templates/cover-letter', auth_middleware_1.default, new_resume_controller_1.downloadCoverLetterTemplate);
exports.default = router;
