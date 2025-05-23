
import express from "express";
import AdminController from "../controllers/admin.controller";
import authMiddleware from "../middleware/auth.middleware";
const router = express.Router();

const adminController = AdminController;

router.post('/register' ,adminController.signUp);

router.post('/login', adminController.login);

// Protected admin routes
router.get('/me', authMiddleware, adminController.getCurrentAdmin);

router.put('/update-me', authMiddleware, adminController.updateMe);

router.delete('/', authMiddleware, adminController.deleteMe);

router.get('/logout', authMiddleware, adminController.logout);

export default router;
