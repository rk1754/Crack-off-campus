"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const resources_controller_1 = __importDefault(require("../controllers/resources.controller"));
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const router = (0, express_1.Router)();
// All resource download routes require authentication
router.get('/download/resume', auth_middleware_1.default, resources_controller_1.default.downloadResumeTemplate);
router.get('/download/referral', auth_middleware_1.default, resources_controller_1.default.downloadReferralTemplate);
router.get('/download/cold-mail', auth_middleware_1.default, resources_controller_1.default.downloadColdMailTemplate);
router.get('/download/cover-letter', auth_middleware_1.default, resources_controller_1.default.downloadCoverLetterTemplate);
router.get('/download/hr-email', auth_middleware_1.default, resources_controller_1.default.downloadHrEmailTemplate);
exports.default = router;
