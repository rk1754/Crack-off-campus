"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const experience_controller_1 = __importDefault(require("../controllers/experience.controller"));
const router = express_1.default.Router();
const experienceController = new experience_controller_1.default();
router.post('/create', experienceController.addExperience);
router.get('/my/experience', experienceController.findExperienceByUser);
router.put('/update', experienceController.updateExperience);
router.get('/:id', experienceController.findExperienceById);
router.delete('/:id', experienceController.deleteExperience);
exports.default = router;
