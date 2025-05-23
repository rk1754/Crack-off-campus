"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const education_controller_1 = __importDefault(require("../controllers/education.controller"));
const router = express_1.default.Router();
const educationController = new education_controller_1.default();
router.post('/add', educationController.addEducation);
router.get('/my/education', educationController.fetchUserEducation);
router.put('/update', educationController.updateEducation);
router.delete('/remove', educationController.removeEducation);
router.get('/:id', educationController.findEducationById);
exports.default = router;
