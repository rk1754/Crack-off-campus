"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const resumeUpload_controller_1 = __importDefault(require("../controllers/resumeUpload.controller"));
const upload_middleware_1 = require("../middleware/upload.middleware");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const router = express_1.default.Router();
const resumeUploadController = new resumeUpload_controller_1.default();
router.post('/upload', auth_middleware_1.default, upload_middleware_1.upload.single("resume"), resumeUploadController.uploadResumeForBooking);
exports.default = router;
