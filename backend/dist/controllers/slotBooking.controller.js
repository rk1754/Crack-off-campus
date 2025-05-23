"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sessionBooking_model_1 = __importDefault(require("../models/sessionBooking.model"));
class SlotBookingController {
    constructor() {
        // Book a slot (service_id, date, time)
        this.bookSlot = async (req, res) => {
            try {
                const { service_id, date, time, payment_status } = req.body;
                const userId = req.user?.id;
                if (!userId) {
                    res.status(400).json({
                        success: false,
                        message: "Please Login to book a slot"
                    });
                    return;
                }
                if (!service_id || !date || !time) {
                    res.status(400).json({
                        success: false,
                        message: "Please provide service_id, date, and time"
                    });
                    return;
                }
                // Check if slot is already booked (not cancelled)
                const existing = await sessionBooking_model_1.default.findOne({
                    where: {
                        service_id,
                        date,
                        time,
                        cancelled: false
                    }
                });
                if (existing) {
                    res.status(409).json({
                        success: false,
                        message: "Slot already booked"
                    });
                    return;
                }
                const booking = await sessionBooking_model_1.default.create({
                    userId,
                    service_id,
                    date,
                    time,
                    cancelled: false,
                    payment_status
                });
                // Optionally send confirmation email here...
                res.status(201).json({
                    success: true,
                    message: "Slot booked successfully",
                    booking
                });
            }
            catch (err) {
                console.error(err);
                res.status(500).json({
                    success: false,
                    message: "Something went wrong"
                });
            }
        };
        // Cancel a booking by booking id
        this.cancelSlot = async (req, res) => {
            try {
                const id = req.params.id;
                if (!id) {
                    res.status(400).json({
                        success: false,
                        message: "Please provide id to cancel a slot"
                    });
                    return;
                }
                const booking = await sessionBooking_model_1.default.findByPk(id);
                if (!booking) {
                    res.status(404).json({
                        success: false,
                        message: "Booking not found"
                    });
                    return;
                }
                if (booking.cancelled) {
                    res.status(400).json({
                        success: false,
                        message: "Booking already cancelled"
                    });
                    return;
                }
                booking.cancelled = true;
                await booking.save();
                // Optionally send cancellation email here...
                res.status(200).json({
                    success: true,
                    message: "Slot cancelled successfully"
                });
            }
            catch (err) {
                console.error(err);
                res.status(500).json({
                    success: false,
                    message: "Something went wrong"
                });
            }
        };
        // Get all bookings for the logged-in user
        this.findMyBookings = async (req, res) => {
            try {
                const userId = req.user?.id;
                if (!userId) {
                    res.status(400).json({
                        success: false,
                        message: "Please Login to view your bookings"
                    });
                    return;
                }
                const bookings = await sessionBooking_model_1.default.findAll({
                    where: { userId }
                });
                res.status(200).json({
                    success: true,
                    message: "Bookings found",
                    bookings
                });
            }
            catch (err) {
                console.error(err);
                res.status(500).json({
                    success: false,
                    message: "Something went wrong"
                });
            }
        };
        // Get all bookings for a service/date (for slot availability)
        this.getBookingsForService = async (req, res) => {
            try {
                const { service_id, date } = req.query;
                if (!service_id) {
                    res.status(400).json({
                        success: false,
                        message: "Please provide service_id"
                    });
                    return;
                }
                const where = { service_id, cancelled: false };
                if (date)
                    where.date = date;
                const bookings = await sessionBooking_model_1.default.findAll({ where });
                res.status(200).json({
                    success: true,
                    bookings
                });
            }
            catch (err) {
                console.error(err);
                res.status(500).json({
                    success: false,
                    message: "Something went wrong"
                });
            }
        };
        // Get a booking by id
        this.getBookingById = async (req, res) => {
            try {
                const id = req.params.id;
                if (!id) {
                    res.status(400).json({
                        success: false,
                        message: "Please provide id to view booking"
                    });
                    return;
                }
                const booking = await sessionBooking_model_1.default.findByPk(id);
                if (!booking) {
                    res.status(404).json({
                        success: false,
                        message: "Booking not found"
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    message: "Booking found",
                    booking
                });
            }
            catch (err) {
                console.error(err);
                res.status(500).json({
                    success: false,
                    message: "Something went wrong"
                });
            }
        };
    }
}
exports.default = SlotBookingController;
