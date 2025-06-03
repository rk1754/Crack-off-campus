import express from "express";
import AdminController from "../controllers/admin.controller";
import authMiddleware from "../middleware/auth.middleware";
<<<<<<< HEAD
=======
import adminMiddleware from "../middleware/admin.middleware";
>>>>>>> 410557a16c5902b86bb8a61d687c4901d1e4fac8
const router = express.Router();

// Use the exported instance, not the class itself
const adminController = AdminController;

<<<<<<< HEAD
router.post('/register' ,adminController.signUp);

router.post('/login', adminController.login);

// Protected admin routes
router.get('/me', authMiddleware, adminController.getCurrentAdmin);

router.put('/update-me', authMiddleware, adminController.updateMe);

router.delete('/', authMiddleware, adminController.deleteMe);

router.get('/logout', authMiddleware, adminController.logout);
=======
router.post("/register", adminController.signUp);

router.post("/login", adminController.login);

// Protected admin routes
router.get("/me", authMiddleware, adminController.getCurrentAdmin);

router.put("/update-me", authMiddleware, adminController.updateMe);

router.delete("/", authMiddleware, adminController.deleteMe);

router.get("/logout", authMiddleware, adminController.logout);

// Delete any user by ID (admin only)
router.delete("/user/:id", adminMiddleware, adminController.deleteUserById);
>>>>>>> 410557a16c5902b86bb8a61d687c4901d1e4fac8

export default router;
