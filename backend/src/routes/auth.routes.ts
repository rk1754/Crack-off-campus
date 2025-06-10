import express from "express";
import AuthController from "../controllers/auth.controller";
import multer from "multer";
import { upload } from "../middleware/upload.middleware";
import adminMiddleware from "../middleware/admin.middleware";
import authMiddleware from "../middleware/auth.middleware";

const router = express.Router();

const authController = new AuthController();

// Special upload configuration for large requests
const largeUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
    fieldSize: 10 * 1024 * 1024, // 10MB per field
    fieldNameSize: 100,
    fields: 30, // Increased for more fields
    files: 5, // Allow more files
    parts: 100, // Allow more parts
  }
});

router.get("/all", adminMiddleware, authController.findAllUser);

router.get("/set_user_premium", authMiddleware, authController.setUserPremium);

router.post("/login", authController.login);

router.post("/register", authController.signup);

router.put('/update-resume', authMiddleware, upload.single('resume'), authController.updateResume);

router.get('/resume', authMiddleware, authController.downloadResume);

router.post("/forgot-password", authMiddleware, authController.forgotPassword);

router.post("/reset-password", authMiddleware, authController.resetPassword);

router.get("/me", authMiddleware, authController.fetchMe);

router.put(
  "/profile",
  authMiddleware,
  upload.single("image"),
  authController.uploadProfileImage
);

router.put(
  "/cover",
  authMiddleware,
  upload.single("image"),
  authController.uploadCoverImage
);

router.post("/add-skills", authMiddleware, authController.addSkills);

router.get("/:id", adminMiddleware, authController.fetchUserById);

router.get("/logout", authMiddleware, authController.logout);

router.put(
  "/update-me",
  largeUpload.fields([
    { name: "profile_pic", maxCount: 1 },
    { name: "cover_image", maxCount: 1 },
  ]),
  authMiddleware,
  authController.updateMe
);

router.delete("/delete-me", authMiddleware, authController.deleteMe);

export default router;
