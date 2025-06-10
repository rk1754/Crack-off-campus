"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_controller_1 = __importDefault(require("../controllers/admin.controller"));
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const admin_middleware_1 = __importDefault(require("../middleware/admin.middleware"));
const router = express_1.default.Router();
// Use the exported instance, not the class itself
const adminController = admin_controller_1.default;
router.post("/register", adminController.signUp);
router.post("/login", adminController.login);
// Protected admin routes
router.get("/me", auth_middleware_1.default, adminController.getCurrentAdmin);
router.put("/update-me", auth_middleware_1.default, adminController.updateMe);
router.delete("/", auth_middleware_1.default, adminController.deleteMe);
router.get("/logout", auth_middleware_1.default, adminController.logout);
// Delete any user by ID (admin only)
router.delete("/user/:id", admin_middleware_1.default, adminController.deleteUserById);
exports.default = router;
