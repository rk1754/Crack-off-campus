"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const slots_controller_1 = __importDefault(require("../controllers/slots.controller"));
const admin_middleware_1 = __importDefault(require("../middleware/admin.middleware"));
const upload_middleware_1 = require("../middleware/upload.middleware");
const router = express_1.default.Router();
const slotController = new slots_controller_1.default();
router.post('/create', admin_middleware_1.default, upload_middleware_1.upload.single("image"), slotController.createSlot);
router.get('/getAll', slotController.getAllSlots);
router.get('/getById/:id', slotController.getSlotById);
router.put('/update/:id', admin_middleware_1.default, slotController.updateSlot);
router.delete('/delete/:id', admin_middleware_1.default, slotController.deleteSlot);
router.post('/createFullWeek', admin_middleware_1.default, slotController.createSlotsForNextWeek);
router.get('/replicate/slots/week', admin_middleware_1.default, slotController.replicateSlotsToNextWeek);
exports.default = router;
