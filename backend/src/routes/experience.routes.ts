import express from "express";
import ExperienceController from "../controllers/experience.controller";
import authMiddleware from "../middleware/auth.middleware";

const router = express.Router();
const experienceController = new ExperienceController();

router.post('/create', authMiddleware, experienceController.addExperience);

router.get('/my/experience',authMiddleware, experienceController.findExperienceByUser);

// Change update to accept :id param
router.put('/update/:id',authMiddleware, experienceController.updateExperience);

router.get('/:id',authMiddleware, experienceController.findExperienceById);

router.delete('/:id',authMiddleware, experienceController.deleteExperience);


export default router;