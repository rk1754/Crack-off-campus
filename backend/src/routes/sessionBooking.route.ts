import express from "express";
import SlotBookingController from "../controllers/slotBooking.controller";
import authMiddleware from "../middleware/auth.middleware";


const router = express.Router();
const slotBookingController = new SlotBookingController();

router.post('/book', authMiddleware, slotBookingController.bookSlot);
router.get('/getAll', authMiddleware, slotBookingController.findMyBookings);
router.get('/getById/:id', authMiddleware, slotBookingController.getBookingById);
router.delete('/cancel/:id', authMiddleware, slotBookingController.cancelSlot);

// For frontend to check which slots are booked for a service/date
router.get('/bookingsForService', slotBookingController.getBookingsForService);

export default router;