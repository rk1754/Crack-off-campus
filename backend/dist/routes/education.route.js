"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const education_controller_1 = __importDefault(require("../controllers/education.controller"));
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const router = express_1.default.Router();
const educationController = new education_controller_1.default();
router.post("/add", auth_middleware_1.default, educationController.addEducation);
router.get("/my/education", auth_middleware_1.default, educationController.fetchUserEducation);
router.put("/update/:id", auth_middleware_1.default, educationController.updateEducation);
router.delete("/remove/:id", auth_middleware_1.default, educationController.removeEducation);
router.get("/:id", auth_middleware_1.default, educationController.findEducationById);
exports.default = router;
