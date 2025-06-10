import { Request, Response } from "express";
import SessionBooking from "../models/sessionBooking.model";
import { transporter } from "../utils/mailer";
import User from "../models/user.model";
import logger from "../utils/logger";
import fs from "fs";
import path from "path";
import multer from "multer";

// Ensure temp directory exists
const tempDir = path.join(__dirname, "../../Uploads/tmp");
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, tempDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname.replace(/\s+/g, "_"));
  },
});
export const uploadResume = multer({ storage });

class SlotBookingController {
  // Book a slot (service_id, date, time, orderId, resumeBase64)
  bookSlot = async (req: Request, res: Response): Promise<void> => {
  try {
    // Accept both camelCase and snake_case for orderId
    const { serviceId, date, service_name, time, email, name, orderId, order_id, resumePath } = req.body;
    const userId = req.user?.id;
    const finalOrderId = orderId || order_id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Please login to book a slot",
      });
      return;
    }

    // Validate input
    if (!serviceId || !date || !time || !finalOrderId) {
      res.status(400).json({
        success: false,
        message: "Please provide service_id, date, time, and orderId",
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
    }

    // Create booking
    const booking = await SessionBooking.create({
      userId,
      service_id: serviceId,
      service_name,
      date,
      time,
      cancelled: false,
      orderId: finalOrderId, // Store orderId for reference
      resumePath, // Store the file path
    });

    // Get user details
    const user = await User.findByPk(userId);
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

    // User confirmation email
    const userHtml = `
      <p>Dear ${user.name},</p>
      <p>Your slot has been booked successfully for <b>${service_name}</b> on <b>${formattedDateTime}</b>.</p>
      <p>You will receive the link to join the session on your registered email.</p>
      <p>Thank you for choosing our services.</p>
      <p>Best Regards,</p>
      <p>Team Crack Off-Campus</p>
    `;

    await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL,
      to: email,
      subject: "Slot Booking Confirmation",
      html: userHtml,
    });

    logger.info(
      `Slot booked successfully for user ${user.name} (${user.email}) on ${date} at ${time}`
    );
    logger.info(`Notification email sent to user ${user.email}`);

    // Admin notification email with resume
    const adminHTML = `
      <p>Dear Admin,</p>
      <p>A new slot has been booked by ${name} (${user.email}) for <b>${service_name}</b> on <b>${formattedDateTime}</b>.</p>
      <p>User Contact: ${user.phone_number}</p>
      <p>Thank you.</p>
      <p>Best Regards,</p>
      <p>Team Crack Off-Campus</p>
    `;

    // Handle resume attachment by path
    let attachments = [];
    if (resumePath && fs.existsSync(resumePath)) {
      const stats = fs.statSync(resumePath);
      if (stats.size > 2 * 1024 * 1024) {
        res.status(400).json({
          success: false,
          message: "Resume file size exceeds 2 MB",
        });
        return;
      }
      attachments.push({
        filename: "resume.pdf",
        path: resumePath,
        contentType: "application/pdf",
      });
    } else {
      logger.info("No resume provided for booking or file not found");
    }

    await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL,
      to: "atharvabhole239@gmail.com",
      subject: "New Slot Booking",
      html: adminHTML,
      attachments,
    });

    logger.info(`Notification email sent to admin about new booking by ${user.email}`);

    // Format booking for response
    res.status(201).json({
      success: true,
      message: "Slot booked successfully",
      booking: {
        ...booking.toJSON(),
        date: booking.date ? new Date(booking.date).toISOString().slice(0, 10) : null,
        time: booking.time ? booking.time.slice(0, 5) : null,
      },
    });
  } catch (err) {
    logger.error("Error in bookSlot:", err);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

  // Upload resume (kept for compatibility, but not used in localStorage flow)
  // ...existing code...
  // Upload resume (now returns file path, not base64)
  uploadResume = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
      return;
    }
    // If file is in memory (buffer), save it to disk
    let filePath = req.file.path;
    if (!filePath && req.file.buffer) {
      // Generate a unique filename
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const safeName = req.file.originalname.replace(/\s+/g, "_");
      filePath = path.join(tempDir, uniqueSuffix + "-" + safeName);
      fs.writeFileSync(filePath, req.file.buffer);
    }

    // Validate file type and size
    if (!req.file.mimetype.includes("pdf")) {
      if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
      res.status(400).json({
        success: false,
        message: "Only PDF files are allowed",
      });
      return;
    }

    const fileSize = req.file.size || (filePath && fs.statSync(filePath).size) || 0;
    if (fileSize > 2 * 1024 * 1024) {
      if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
      res.status(400).json({
        success: false,
        message: "Resume file size exceeds 2 MB",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Resume uploaded successfully",
      resumePath: filePath, // Always return the disk path
    });
  } catch (error) {
    logger.error("Error in uploadResume:", error);
    // Clean up file if it was saved
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      success: false,
      message: "Failed to upload resume",
    });
  }
};
// ...existing code...

  // Cancel a booking by booking id
  cancelSlot = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
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

      res.status(200).json({
        success: true,
        message: "Slot cancelled successfully",
      });
    } catch (err) {
      logger.error("Error in cancelSlot:", err);
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
        res.status(401).json({
          success: false,
          message: "Please login to view your bookings",
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
      logger.error("Error in findMyBookings:", err);
      res.status(500).json({
        success: false,
        message: "Something went wrong",
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
      logger.error("Error in getBookingsForService:", err);
      res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  };

  // Get a booking by id
  getBookingById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
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
      logger.error("Error in getBookingById:", err);
      res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  };
}

export default SlotBookingController;