import express from "express";
import ExperienceController from "../controllers/experience.controller";
import authMiddleware from "../middleware/auth.middleware";

const router = express.Router();
const experienceController = new ExperienceController();

router.post('/create', authMiddleware, experienceController.addExperience);

router.get('/my/experience',authMiddleware, experienceController.findExperienceByUser);

router.put('/update',authMiddleware, experienceController.updateExperience);

router.get('/:id',authMiddleware, experienceController.findExperienceById);

router.delete('/:id',authMiddleware, experienceController.deleteExperience);


export default router;