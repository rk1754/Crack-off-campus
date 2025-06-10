import express from "express";
import SlotBookingController, { uploadResume } from "../controllers/slotBooking.controller";
import authMiddleware from "../middleware/auth.middleware";
import { upload } from "../middleware/upload.middleware";
import expressSession from "express-session";

const router = express.Router();
const slotBookingController = new SlotBookingController();
router.use(expressSession({
    secret:"aspfiongwrbobwboqfbow"
}));
router.post('/book',uploadResume.single("resume"), authMiddleware, slotBookingController.bookSlot);
router.get('/getAll', authMiddleware, slotBookingController.findMyBookings);
router.get('/getById/:id', authMiddleware, slotBookingController.getBookingById);
router.delete('/cancel/:id', authMiddleware, slotBookingController.cancelSlot);

// For frontend to check which slots are booked for a service/date
router.get('/bookingsForService', slotBookingController.getBookingsForService);


router.post('/upload-resume', upload.single("resume"), authMiddleware, slotBookingController.uploadResume);

export default router;