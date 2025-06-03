import express from "express";
import EducationController from "../controllers/education.controller";
import authMiddleware from "../middleware/auth.middleware";
const router = express.Router();

const educationController = new EducationController();

router.post("/add", authMiddleware, educationController.addEducation);

router.get(
  "/my/education",
  authMiddleware,
  educationController.fetchUserEducation
);

router.put("/update/:id", authMiddleware, educationController.updateEducation);

router.delete(
  "/remove/:id",
  authMiddleware,
  educationController.removeEducation
);

router.get("/:id", authMiddleware, educationController.findEducationById);

export default router;
