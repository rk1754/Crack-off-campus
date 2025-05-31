"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const experience_controller_1 = __importDefault(require("../controllers/experience.controller"));
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const router = express_1.default.Router();
const experienceController = new experience_controller_1.default();
router.post('/create', auth_middleware_1.default, experienceController.addExperience);
router.get('/my/experience', auth_middleware_1.default, experienceController.findExperienceByUser);
// Change update to accept :id param
router.put('/update/:id', auth_middleware_1.default, experienceController.updateExperience);
router.get('/:id', auth_middleware_1.default, experienceController.findExperienceById);
router.delete('/:id', auth_middleware_1.default, experienceController.deleteExperience);
exports.default = router;
