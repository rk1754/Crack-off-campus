import express from "express";
import EducationController from "../controllers/education.controller";
const router = express.Router();

const educationController = new EducationController();

router.post('/add', educationController.addEducation);

router.get('/my/education', educationController.fetchUserEducation);

router.put('/update', educationController.updateEducation);

router.delete('/remove', educationController.removeEducation);

router.get('/:id', educationController.findEducationById);

export default router;