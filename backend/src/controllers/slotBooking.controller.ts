import { Request, Response } from "express";
import SessionBooking from "../models/sessionBooking.model";
import { transporter } from "../utils/mailer";
import { SMTP_USER } from "../config/config";
import Admin from "../models/admin.model";
import User from "../models/user.model";
import logger from "../utils/logger";
import Service from "../models/session.model"; // Add this import

class SlotBookingController {
  // Helper function to validate resume URL
  private isValidResumeUrl = (url: string | null | undefined): boolean => {
    if (!url) return false;
    if (typeof url !== 'string') return false;
    const trimmed = url.trim();
    if (trimmed === '' || trimmed === 'null' || trimmed === 'undefined') return false;
    try {
      new URL(trimmed);
      return true;
    } catch {
      return false;
    }
  };

  // Helper function to extract file extension from URL
  private getFileExtensionFromUrl = (url: string): string => {
    if (!url) return 'pdf';
    const match = url.match(/\.([^.?]+)(\?|$)/);
    return match ? match[1].toLowerCase() : 'pdf';
  };

  // Helper function to generate safe filename
  private generateSafeFilename = (userName: string, extension: string): string => {
    const safeName = (userName || 'User').replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
    return `${safeName}_Resume.${extension}`;
  };

  // Book a slot (service_id, date, time)
  bookSlot = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log("=== BOOKING REQUEST DEBUG ===");
      console.log("req.body:", req.body);
      console.log("req.user:", req.user);
      console.log("=== END DEBUG ===");
      
      const { serviceId, date, service_name, time, resumeUrl } = req.body;
      const userId = req.user?.id;
      if (!userId) {
        res.status(400).json({
          success: false,
          message: "Please Login to book a slot",
        });
        return;
      }      logger.info("Logging input data of slot booking", serviceId, date, service_name, time, resumeUrl);
      
      // Debug resume URL
      console.log("=== RESUME URL DEBUG ===");
      console.log("resumeUrl:", resumeUrl);
      console.log("resumeUrl type:", typeof resumeUrl);
      console.log("resumeUrl length:", resumeUrl?.length);
      console.log("=== END RESUME DEBUG ===");
      
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
      const formattedDateTime = istDateObj.toLocaleString("en-IN", options);      console.log(service_name, date, time, formattedDateTime);

      // Use helper functions for resume validation
      const hasValidResume = this.isValidResumeUrl(resumeUrl);
      const resumeFileExtension = hasValidResume ? this.getFileExtensionFromUrl(resumeUrl) : 'pdf';
      const downloadFileName = this.generateSafeFilename(user.name || 'User', resumeFileExtension);

      console.log("=== RESUME VALIDATION ===");
      console.log("hasValidResume:", hasValidResume);
      console.log("resumeUrl:", resumeUrl);
      console.log("downloadFileName:", downloadFileName);
      console.log("=== END VALIDATION ===");// User email
      const userHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 20px;">Slot Booking Confirmation</h2>
            <p>Dear ${user.name || 'User'},</p>
            <p>Your slot has been booked successfully for <b>${service_name}</b> on <b>${date} at ${time}</b>.</p>
            
            ${hasValidResume ? `
            <div style="margin: 20px 0; padding: 15px; background-color: #f0f8ff; border-radius: 5px; border-left: 4px solid #667eea;">
              <p style="margin: 0 0 10px 0; font-weight: bold; color: #333;">📄 Your Resume:</p>
              <a href="${resumeUrl}" 
                 download="${downloadFileName}" 
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
                <span style="margin-right: 8px;">📥</span>Download Your Resume (${resumeFileExtension.toUpperCase()})
              </a>
              <p style="margin: 10px 0 0 0; font-size: 12px; color: #666;">Click the button above to download your uploaded resume</p>
            </div>` : `
            <div style="margin: 20px 0; padding: 15px; background-color: #fff3cd; border-radius: 5px; border-left: 4px solid #ffc107;">
              <p style="margin: 0; color: #856404; font-style: italic;">📋 No resume was uploaded for this booking</p>
            </div>`}
            
            <p>You will receive the link to join the session on your registered email.</p>
            <p>Thank you for choosing our services.</p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="margin: 0;">Best Regards,</p>
              <p style="margin: 5px 0 0 0; font-weight: bold; color: #667eea;">Team Crack Off-Campus</p>
            </div>
          </div>
        </div>
      `;

      // Admin email template
      const adminHTML = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 20px;">🔔 New Slot Booking Alert</h2>
            <p>Dear Admin,</p>
            <p>A new slot has been booked by <b>${user.name || 'User'}</b> (<a href="mailto:${user.email}">${user.email}</a>) for <b>${service_name}</b> on <b>${date} ${time}</b>.</p>
            
            <div style="margin: 20px 0; padding: 15px; background-color: #e8f4fd; border-radius: 5px; border-left: 4px solid #2196F3;">
              <p style="margin: 0 0 5px 0;"><b>📞 User Contact:</b> ${user.phone_number || 'Not provided'}</p>
              <p style="margin: 0;"><b>📧 User Email:</b> ${user.email}</p>
            </div>
            
            ${hasValidResume ? `
            <div style="margin: 20px 0; padding: 15px; background-color: #f0f8ff; border-radius: 5px; border-left: 4px solid #667eea;">
              <p style="margin: 0 0 10px 0; font-weight: bold; color: #333;">📄 User's Resume:</p>
              <a href="${resumeUrl}" 
                 download="${downloadFileName}" 
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
                <span style="margin-right: 8px;">📥</span>Download Resume (${resumeFileExtension.toUpperCase()})
              </a>
              <p style="margin: 10px 0 0 0; font-size: 12px; color: #666;">Click to download ${user.name || 'User'}'s resume</p>
            </div>` : `
            <div style="margin: 20px 0; padding: 15px; background-color: #fff3cd; border-radius: 5px; border-left: 4px solid #ffc107;">
              <p style="margin: 0; color: #856404; font-style: italic;">📋 No resume uploaded by the user</p>
            </div>`}
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="margin: 0;">Best Regards,</p>
              <p style="margin: 5px 0 0 0; font-weight: bold; color: #667eea;">Team Crack Off-Campus</p>
            </div>
          </div>
        </div>
      `;      // Send emails asynchronously for faster response
      const sendEmails = async () => {
        try {
          // Prepare email options
          const userEmailOptions = {
            from: process.env.SMTP_FROM_EMAIL,
            to: user.email,
            subject: "Slot Booking Confirmation - Crack Off-Campus",
            html: userHtml,
            priority: 'high' as const, // High priority for faster delivery
          };

          const adminEmailOptions = {
            from: process.env.SMTP_FROM_EMAIL,
            to: "crackoffcampus63@gmail.com",
            subject: "New Slot Booking - Admin Notification",
            html: adminHTML,
            priority: 'high' as const, // High priority for faster delivery
          };

          // Send both emails in parallel for faster delivery
          const [userEmailResult, adminEmailResult] = await Promise.allSettled([
            transporter.sendMail(userEmailOptions),
            transporter.sendMail(adminEmailOptions)
          ]);

          // Log results
          if (userEmailResult.status === 'fulfilled') {
            logger.info(`Notification email sent to user ${user.email}`);
          } else {
            logger.error(`Failed to send email to user ${user.email}:`, userEmailResult.reason);
          }

          if (adminEmailResult.status === 'fulfilled') {
            logger.info(`Notification email sent to admin about new booking by ${user.email}`);
          } else {
            logger.error(`Failed to send email to admin about booking by ${user.email}:`, adminEmailResult.reason);
          }

          logger.info(
            `Slot booked successfully for user ${user.name || 'User'} (${user.email}) on ${date} at ${time}`
          );
        } catch (emailError) {
          logger.error("Email sending error:", emailError);
          // Don't throw error to avoid blocking the response
        }
      };

      // Send emails in background (non-blocking)
      sendEmails();

      // Format booking for response
      res.status(201).json({
        success: true,
        message: "Slot booked successfully",
        booking: {
          ...booking.toJSON(),          date: booking.date ? new Date(booking.date).toISOString().slice(0, 10) : null, // YYYY-MM-DD
          time: booking.time ? booking.time.slice(0, 5) : null, // HH:mm
        },
      });
    } catch (err: any) {
      console.error("Booking error:", err);
      logger.error("Booking error:", {
        message: err.message,
        name: err.name,
        stack: err.stack
      });
      res.status(500).json({
        success: false,
        message: "Something went wrong",
        error: process.env.NODE_ENV === "development" ? err.message : undefined
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

  // Check slot availability without booking
  checkSlotAvailability = async (req: Request, res: Response): Promise<void> => {
    try {
      const { serviceId, date, time } = req.query;
      
      if (!serviceId || !date || !time) {
        res.status(400).json({
          success: false,
          message: "Please provide serviceId, date, and time",
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

      const isAvailable = !existing;

      res.status(200).json({
        success: true,
        available: isAvailable,
        message: isAvailable ? "Slot is available" : "Slot is already booked",
      });
    } catch (err) {
      console.error("Error checking slot availability:", err);
      res.status(500).json({
        success: false,
        message: "Something went wrong while checking slot availability",
      });
    }
  };

}

export default SlotBookingController;
