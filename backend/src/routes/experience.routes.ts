import express from "express";
import ExperienceController from "../controllers/experience.controller";

const router = express.Router();
const experienceController = new ExperienceController();

router.post('/create', experienceController.addExperience);

router.get('/my/experience', experienceController.findExperienceByUser);

router.put('/update', experienceController.updateExperience);

router.get('/:id', experienceController.findExperienceById);

router.delete('/:id', experienceController.deleteExperience);


export default router;