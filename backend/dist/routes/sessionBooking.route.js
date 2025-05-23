"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const slotBooking_controller_1 = __importDefault(require("../controllers/slotBooking.controller"));
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const router = express_1.default.Router();
const slotBookingController = new slotBooking_controller_1.default();
router.post('/book', auth_middleware_1.default, slotBookingController.bookSlot);
router.get('/getAll', auth_middleware_1.default, slotBookingController.findMyBookings);
router.get('/getById/:id', auth_middleware_1.default, slotBookingController.getBookingById);
router.delete('/cancel/:id', auth_middleware_1.default, slotBookingController.cancelSlot);
// For frontend to check which slots are booked for a service/date
router.get('/bookingsForService', slotBookingController.getBookingsForService);
exports.default = router;
