import express from "express";
import SlotController from "../controllers/slots.controller";
import adminMiddleware from "../middleware/admin.middleware";
import { upload } from "../middleware/upload.middleware";
const router = express.Router();
const slotController = new SlotController();

router.post('/create',adminMiddleware, upload.single("image"), slotController.createSlot);

router.get('/getAll', slotController.getAllSlots);
router.get('/getById/:id', slotController.getSlotById);
router.put('/update/:id',adminMiddleware, slotController.updateSlot);

router.delete('/delete/:id',adminMiddleware, slotController.deleteSlot);

router.post('/createFullWeek',adminMiddleware, slotController.createSlotsForNextWeek);

router.get('/replicate/slots/week',adminMiddleware, slotController.replicateSlotsToNextWeek);


export default router;