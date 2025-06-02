import { Router } from 'express';
import { downloadResumeTemplate, downloadColdMailTemplate, downloadCoverLetterTemplate, downloadHrEmailTemplate, downloadReferralTemplate } from '../controllers/new_resume.controller';
import authMiddleware from '../middleware/auth.middleware';

const router = Router();

router.get('/download/templates/resume',authMiddleware, downloadResumeTemplate);
router.get('/download/templates/hr-email',authMiddleware, downloadHrEmailTemplate);
router.get('/download/templates/referral',authMiddleware, downloadReferralTemplate);
router.get('/download/templates/cold-mail',authMiddleware, downloadColdMailTemplate);
router.get('/download/templates/cover-letter',authMiddleware, downloadCoverLetterTemplate);

export default router;