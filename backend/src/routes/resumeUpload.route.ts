import express from "express";
import ResumeUploadController from "../controllers/resumeUpload.controller";
import { upload } from "../middleware/upload.middleware";
import authMiddleware from "../middleware/auth.middleware";

const router = express.Router();
const resumeUploadController = new ResumeUploadController();

router.post('/upload', authMiddleware, upload.single("resume"), resumeUploadController.uploadResumeForBooking);

export default router;
