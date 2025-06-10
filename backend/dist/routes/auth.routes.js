"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const multer_1 = __importDefault(require("multer"));
const upload_middleware_1 = require("../middleware/upload.middleware");
const admin_middleware_1 = __importDefault(require("../middleware/admin.middleware"));
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const router = express_1.default.Router();
const authController = new auth_controller_1.default();
// Special upload configuration for large requests
const largeUpload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB per file
        fieldSize: 10 * 1024 * 1024, // 10MB per field
        fieldNameSize: 100,
        fields: 30, // Increased for more fields
        files: 5, // Allow more files
        parts: 100, // Allow more parts
    }
});
router.get("/all", admin_middleware_1.default, authController.findAllUser);
router.get("/set_user_premium", auth_middleware_1.default, authController.setUserPremium);
router.post("/login", authController.login);
router.post("/register", authController.signup);
router.put('/update-resume', auth_middleware_1.default, upload_middleware_1.upload.single('resume'), authController.updateResume);
router.get('/resume', auth_middleware_1.default, authController.downloadResume);
router.post("/forgot-password", auth_middleware_1.default, authController.forgotPassword);
router.post("/reset-password", auth_middleware_1.default, authController.resetPassword);
router.get("/me", auth_middleware_1.default, authController.fetchMe);
router.put("/profile", auth_middleware_1.default, upload_middleware_1.upload.single("image"), authController.uploadProfileImage);
router.put("/cover", auth_middleware_1.default, upload_middleware_1.upload.single("image"), authController.uploadCoverImage);
router.post("/add-skills", auth_middleware_1.default, authController.addSkills);
router.get("/:id", admin_middleware_1.default, authController.fetchUserById);
router.get("/logout", auth_middleware_1.default, authController.logout);
router.put("/update-me", largeUpload.fields([
    { name: "profile_pic", maxCount: 1 },
    { name: "cover_image", maxCount: 1 },
]), auth_middleware_1.default, authController.updateMe);
router.delete("/delete-me", auth_middleware_1.default, authController.deleteMe);
exports.default = router;
