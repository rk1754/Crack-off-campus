import express from "express";
import ResumeController from "../controllers/resume.controller";
import { upload } from "../middleware/upload.middleware";
import adminMiddleware from "../middleware/admin.middleware";
import authMiddleware from "../middleware/auth.middleware";

const router = express.Router();
const resumeController = new ResumeController();

router.post('/new',adminMiddleware,upload.single("file"), resumeController.uploadResume);

router.get('/type/:type', resumeController.getTemplatesByType);


router.get('/all', authMiddleware, resumeController.getAllTemplates);

router.get('/admin/all', adminMiddleware, resumeController.getAllTemplatesAdmin);

router.get('/:id',authMiddleware, resumeController.downloadTemplate);

router.put('/:id', adminMiddleware, upload.single("file") , resumeController.updateTemplateUpload);

router.delete('/:id', adminMiddleware, resumeController.deleteTemplate);

router.get('/user/all', authMiddleware, resumeController.downloadAllTemplates);

router.get('/admin/all', adminMiddleware, resumeController.downloadAllTemplates);

router.get('/admin/:id', adminMiddleware, resumeController.downloadTemplateAdmin);

export default router;