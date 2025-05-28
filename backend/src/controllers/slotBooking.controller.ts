import { Request, Response } from "express";
import SessionBooking from "../models/sessionBooking.model";
import { transporter } from "../utils/mailer";
import { SMTP_USER } from "../config/config";
import Admin from "../models/admin.model";
import User from "../models/user.model";

class SlotBookingController {
    // Book a slot (service_id, date, time)
    bookSlot = async (req: Request, res: Response): Promise<void> => {
        try {
            console.log(req.body);
            const { serviceId, date, time,  } = req.body;
            const userId = req.user?.id;
            if (!userId) {
                res.status(400).json({
                    success: false,
                    message: "Please Login to book a slot"
                });
                return;
            }
            if (!serviceId || !date || !time) {
                res.status(400).json({
                    success: false,
                    message: "Please provide service_id, date, and time"
                });
                return;
            }
            // Check if slot is already booked (not cancelled)
            const existing = await SessionBooking.findOne({
                where: {
                    service_id: serviceId,
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
            const booking = await SessionBooking.create({
                userId,
                service_id: serviceId,
                date,
                time,
                cancelled: false,
            });
            const u = req.user;
            if(!u){
                res.status(401).json({
                    success: false,
                    message: "Unauthorized user"
                });
                return;
            }
            const user = await User.findByPk(u.id);
            if(!user){
                res.status(404).json({
                    success: false,
                    message: "User not found"
                });
                return;
            }
            // Optionally send confirmation email here...
            await transporter.sendMail({
        from: process.env.SMTP_FROM_EMAIL,
        to: user.email,
        subject: "Password Reset Request",
        html: `
        <p>Dear ${user.name},</p>
        <p>Your slot has been booked successfully for the service on ${date} at ${time}.</p>
        <p> You will receive the link to join the session on your registered email.</p>
        <p>Thank you for choosing our services.</p>
        <p>Best regards,</p>
        <p>Team Crack off Campus</p>
                `,
      });

      await transporter.sendMail({
        from: process.env.SMTP_FROM_EMAIL,
        to: "crackoffcampus63@gmail.com",
        subject: "New Slot Booking",
        html: `
        <p>Dear Admin,</p>
        <p>A new slot has been booked by ${user.name} (${user.email}) for the service on ${date} at ${time}.</p>
        <p>Thank you.</p>
        <p>Best regards,</p>
        <p>Team Crack off Campus</p>
                `,
      })
            res.status(201).json({
                success: true,
                message: "Slot booked successfully",
                booking
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({
                success: false,
                message: "Something went wrong"
            });
        }
    };

    // Cancel a booking by booking id
    cancelSlot = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.params.id;
            if (!id) {
                res.status(400).json({
                    success: false,
                    message: "Please provide id to cancel a slot"
                });
                return;
            }
            const booking = await SessionBooking.findByPk(id);
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
        } catch (err) {
            console.error(err);
            res.status(500).json({
                success: false,
                message: "Something went wrong"
            });
        }
    };

    // Get all bookings for the logged-in user
    findMyBookings = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(400).json({
                    success: false,
                    message: "Please Login to view your bookings"
                });
                return;
            }
            const bookings = await SessionBooking.findAll({
                where: { userId }
            });
            res.status(200).json({
                success: true,
                message: "Bookings found",
                bookings
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({
                success: false,
                message: "Something went wrong"
            });
        }
    };

    // Get all bookings for a service/date (for slot availability)
    getBookingsForService = async (req: Request, res: Response): Promise<void> => {
        try {
            const { service_id, date } = req.query;
            if (!service_id) {
                res.status(400).json({
                    success: false,
                    message: "Please provide service_id"
                });
                return;
            }
            const where: any = { service_id, cancelled: false };
            if (date) where.date = date;
            const bookings = await SessionBooking.findAll({ where });
            res.status(200).json({
                success: true,
                bookings
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({
                success: false,
                message: "Something went wrong"
            });
        }
    };

    // Get a booking by id
    getBookingById = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.params.id;
            if (!id) {
                res.status(400).json({
                    success: false,
                    message: "Please provide id to view booking"
                });
                return;
            }
            const booking = await SessionBooking.findByPk(id);
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
        } catch (err) {
            console.error(err);
            res.status(500).json({
                success: false,
                message: "Something went wrong"
            });
        }
    };
}

export default SlotBookingController;