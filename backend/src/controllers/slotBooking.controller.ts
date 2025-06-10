import { Request, Response } from "express";
import SessionBooking from "../models/sessionBooking.model";
import { transporter } from "../utils/mailer";
import { SMTP_USER } from "../config/config";
import Admin from "../models/admin.model";
import User from "../models/user.model";
import logger from "../utils/logger";
import Service from "../models/session.model"; // Add this import

class SlotBookingController {
  // Book a slot (service_id, date, time)
  bookSlot = async (req: Request, res: Response): Promise<void> => {
    try {
      const { serviceId, date, service_name, time, resumeUrl } = req.body;
      const userId = req.user?.id;
      if (!userId) {
        res.status(400).json({
          success: false,
          message: "Please Login to book a slot",
        });
        return;
      }
      logger.info("Logging input data of slot booking", serviceId, date, service_name, time, resumeUrl);
      // Validate input
      if (!serviceId || !date || !time) {
        res.status(400).json({
          success: false,
          message: "Please provide service_id, date, and time",
        });
        return;
      }

      // Check if slot is already booked (not cancelled)
      const existing = await SessionBooking.findOne({
        where: {
          service_id: serviceId,
          date,
          time,
          cancelled: false,
        },
      });
      if (existing) {
        res.status(409).json({
          success: false,
          message: "Slot already booked",
        });
        return;
      }      const booking = await SessionBooking.create({
        userId,
        service_id: serviceId,
        service_name: service_name,
        date,
        time,
        resume_url: resumeUrl || null,
        cancelled: false,
      });

      const u = req.user;
      if (!u) {
        res.status(401).json({
          success: false,
          message: "Unauthorized user",
        });
        return;
      }
      const user = await User.findByPk(u.id);
      if (!user) {
        res.status(404).json({
          success: false,
          message: "User not found",
        });
        return;
      }

      // Format date and time to Indian Standard Time (IST) for email
      const istDateObj = new Date(`${date}T${time}:00Z`);
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
      };
      const formattedDateTime = istDateObj.toLocaleString("en-IN", options);
      console.log(service_name, date, time, formattedDateTime);      // User email
      const userHtml = `
        <p>Dear ${user.name},</p>
        <p>Your slot has been booked successfully for <b>${service_name}</b> on <b>${date} at ${time}</b>.</p>
        ${resumeUrl ? `
        <div style="margin: 20px 0;">
          <p>Your uploaded resume:</p>
          <a href="${resumeUrl.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '.pdf')}" 
             download="${user.name}_Resume.pdf" 
             target="_blank" 
             style="display: inline-block; 
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; 
                    padding: 12px 24px; 
                    text-decoration: none; 
                    border-radius: 8px; 
                    font-weight: 600; 
                    font-size: 14px; 
                    text-align: center; 
                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3); 
                    transition: all 0.3s ease; 
                    border: none; 
                    cursor: pointer;">
            <span style="margin-right: 8px;">📄</span>Click here to view Resume
          </a>
        </div>` : ''}
        <p>You will receive the link to join the session on your registered email.</p>
        <p>Thank you for choosing our services.</p>
        <p>Best Regards,</p>
        <p>Team Crack Off-Campus</p>
      `;

      await transporter.sendMail({
        from: process.env.SMTP_FROM_EMAIL,
        to: user.email,
        subject: "Slot Booking Confirmation",
        html: userHtml,
      });

      logger.info(
        `Slot booked successfully for user ${user.name} (${user.email}) on ${date} at ${time}`
      );
      logger.info(`Notification email sent to user ${user.email}`);      // Admin email
      const adminHTML = `
        <p>Dear Admin,</p>
        <p>A new slot has been booked by ${user.name} (${user.email}) for <b>${service_name}</b> on <b>${date} ${time}</b>.</p>
        <p>User Contact: ${user.phone_number}</p>
        ${resumeUrl ? `
        <div style="margin: 20px 0;">
          <a href="${resumeUrl.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '.pdf')}" 
             download="${user.name}_Resume.pdf" 
             target="_blank" 
             style="display: inline-block; 
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; 
                    padding: 12px 24px; 
                    text-decoration: none; 
                    border-radius: 8px; 
                    font-weight: 600; 
                    font-size: 14px; 
                    text-align: center; 
                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3); 
                    transition: all 0.3s ease; 
                    border: none; 
                    cursor: pointer;">
            <span style="margin-right: 8px;">📄</span>Click here to view Resume
          </a>
        </div>` : '<p style="color: #666; font-style: italic;">No resume uploaded</p>'}
        <p>Thank you.</p>
        <p>Best Regards,</p>
        <p>Team Crack Off-Campus</p>
      `;await transporter.sendMail({
        from: process.env.SMTP_FROM_EMAIL,
        to: "crackoffcampus63@gmail.com",
        subject: "New Slot Booking",
        html: adminHTML,
      });

      logger.info(
        `Notification email sent to admin about new booking by ${user.email}`
      );

      // Format booking for response
      res.status(201).json({
        success: true,
        message: "Slot booked successfully",
        booking: {
          ...booking.toJSON(),
          date: booking.date ? new Date(booking.date).toISOString().slice(0, 10) : null, // YYYY-MM-DD
          time: booking.time ? booking.time.slice(0, 5) : null, // HH:mm
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Something went wrong",
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
          message: "Please provide id to cancel a slot",
        });
        return;
      }
      const booking = await SessionBooking.findByPk(id);
      if (!booking) {
        res.status(404).json({
          success: false,
          message: "Booking not found",
        });
        return;
      }
      if (booking.cancelled) {
        res.status(400).json({
          success: false,
          message: "Booking already cancelled",
        });
        return;
      }
      booking.cancelled = true;
      await booking.save();

      // Optionally send cancellation email here...

      res.status(200).json({
        success: true,
        message: "Slot cancelled successfully",
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Something went wrong",
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
          message: "Please Login to view your bookings",
        });
        return;
      }
      const bookings = await SessionBooking.findAll({
        where: { userId },
      });
      res.status(200).json({
        success: true,
        message: "Bookings found",
        bookings,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  };

  // Get all bookings for a service/date (for slot availability)
  getBookingsForService = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { service_id, date } = req.query;
      if (!service_id) {
        res.status(400).json({
          success: false,
          message: "Please provide service_id",
        });
        return;
      }
      const where: any = { service_id, cancelled: false };
      if (date) where.date = date;
      const bookings = await SessionBooking.findAll({ where });
      res.status(200).json({
        success: true,
        bookings,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Something went wrong",
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
          message: "Please provide id to view booking",
        });
        return;
      }
      const booking = await SessionBooking.findByPk(id);
      if (!booking) {
        res.status(404).json({
          success: false,
          message: "Booking not found",
        });
        return;
      }
      res.status(200).json({
        success: true,
        message: "Booking found",
        booking,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  };
}

export default SlotBookingController;
