import { Router } from 'express';
import resourcesController from '../controllers/resources.controller';
import authMiddleware from '../middleware/auth.middleware';

const router = Router();

// Debug endpoint (remove in production)
router.get('/debug', authMiddleware, resourcesController.debugPaths);

// All resource download routes require authentication
router.get('/download/resume', authMiddleware, resourcesController.downloadResumeTemplate);
router.get('/download/referral', authMiddleware, resourcesController.downloadReferralTemplate);
router.get('/download/cold-mail', authMiddleware, resourcesController.downloadColdMailTemplate);
router.get('/download/cover-letter', authMiddleware, resourcesController.downloadCoverLetterTemplate);
router.get('/download/hr-email', authMiddleware, resourcesController.downloadHrEmailTemplate);

export default router;
