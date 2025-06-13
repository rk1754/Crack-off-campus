import { Request, Response } from "express";
import SessionBooking from "../models/sessionBooking.model";
import { transporter } from "../utils/mailer";
import User from "../models/user.model";
import logger from "../utils/logger";
import axios from "axios";
import fs from "fs";
import path from "path";

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
  private getFileExtensionFromUrl = (url: string): string => {
    if (!url) return 'pdf';
    const urlMatch = url.match(/\.([^.?]+)(\?|$)/);
    if (urlMatch) {
      const ext = urlMatch[1].toLowerCase();
      // Map common document extensions
      if (ext === 'pdf') return 'pdf';
      if (ext === 'doc' || ext === 'docx') return ext;
    }
    if (url.includes('cloudinary.com')) {
      const pathParts = url.split('/');
      const filename = pathParts[pathParts.length - 1];
      const fileMatch = filename.match(/\.([^.?]+)(\?|$)/);
      if (fileMatch) {
        return fileMatch[1].toLowerCase();
      }
    }
    return 'pdf';
  };
  private generateSafeFilename = (userName: string, extension: string): string => {
    const safeName = (userName || 'User').replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
    const validExt = extension || 'pdf';
    return `${safeName}_Resume.${validExt}`;
  };

  // Helper function to download resume from URL and save it locally as PDF
  private downloadAndSaveResume = async (resumeUrl: string, fileName: string): Promise<string | null> => {
    try {
      if (!this.isValidResumeUrl(resumeUrl)) {
        return null;
      }

      // Create uploads directory if it doesn't exist
      const uploadsDir = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      // Generate unique filename with PDF extension
      const timestamp = Date.now();
      const safeFileName = `${fileName.replace(/\.[^/.]+$/, '')}_${timestamp}.pdf`;
      const filePath = path.join(uploadsDir, safeFileName);      // Download the file
      const response = await axios({
        method: 'GET',
        url: resumeUrl,
        responseType: 'stream',
        timeout: 30000, // 30 second timeout
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      // Save the file
      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on('finish', () => {
          console.log(`Resume saved successfully: ${filePath}`);
          // Cleanup old files (older than 7 days)
          this.cleanupOldFiles();
          resolve(safeFileName);
        });
        writer.on('error', (error) => {
          console.error('Error saving resume:', error);
          // Clean up partial file
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
          reject(error);
        });
      });    } catch (error) {
      console.error('Error downloading resume:', error);
      return null;
    }
  };

  // Cleanup old files (older than 7 days)
  private cleanupOldFiles = (): void => {
    try {
      const uploadsDir = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        return;
      }

      const files = fs.readdirSync(uploadsDir);
      const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000); // 7 days in milliseconds

      files.forEach(file => {
        const filePath = path.join(uploadsDir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.isFile() && stats.mtime.getTime() < oneWeekAgo) {
          fs.unlinkSync(filePath);
          console.log(`Cleaned up old file: ${file}`);
        }
      });
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  };

  // Serve locally saved resume files
  serveResumeFile = async (req: Request, res: Response): Promise<void> => {
    try {
      const { fileName } = req.params;
      
      if (!fileName) {
        res.status(400).json({
          success: false,
          message: "File name is required",
        });
        return;
      }

      const filePath = path.join(process.cwd(), 'uploads', fileName);
      
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        res.status(404).json({
          success: false,
          message: "File not found",
        });
        return;
      }

      // Set appropriate headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.setHeader('Cache-Control', 'no-cache');

      // Stream the file
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
      
    } catch (error) {
      console.error('Error serving resume file:', error);
      res.status(500).json({
        success: false,
        message: "Error serving file",
      });
    }
  };// Book a slot (service_id, date, time)
  bookSlot = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log("=== BOOKING REQUEST DEBUG ===");
      console.log("req.body:", req.body);
      console.log("req.user:", req.user);
      console.log("=== END DEBUG ===");
      
      const { serviceId, date, service_name, time, resumeUrl, payment_status } = req.body;
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(400).json({
          success: false,
          message: "Please Login to book a slot",
          errorCode: "USER_NOT_AUTHENTICATED"
        });
        return;
      }
      
      logger.info("Logging input data of slot booking", serviceId, date, service_name, time, resumeUrl, payment_status);
      
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
          errorCode: "MISSING_REQUIRED_FIELDS"
        });
        return;
      }

      // Validate payment_status if provided
      const validPaymentStatuses = ['pending', 'completed', 'failed'];
      let validatedPaymentStatus = payment_status;
      
      if (payment_status) {
        if (payment_status === 'paid') {
          validatedPaymentStatus = 'completed';
          console.log("Converting payment_status from 'paid' to 'completed'");
        } else if (!validPaymentStatuses.includes(payment_status)) {
          res.status(400).json({
            success: false,
            message: `Invalid payment_status. Must be one of: ${validPaymentStatuses.join(', ')}`,
            errorCode: "INVALID_PAYMENT_STATUS"
          });
          return;
        }
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
          errorCode: "SLOT_ALREADY_BOOKED"
        });
        return;
      }

      console.log("=== CREATING BOOKING WITH DATA ===");
      const bookingData = {
        userId,
        service_id: serviceId,
        service_name: service_name,
        date,
        time,
        resume_url: resumeUrl || null,
        cancelled: false,
        payment_status: validatedPaymentStatus || 'pending'
      };
      console.log("Booking data:", bookingData);
      console.log("=== END BOOKING DATA ===");

      const booking = await SessionBooking.create(bookingData);

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
      const formattedDateTime = istDateObj.toLocaleString("en-IN", options);      console.log(service_name, date, time, formattedDateTime);      // Use helper functions for resume validation
      const hasValidResume = this.isValidResumeUrl(resumeUrl);
      const resumeFileExtension = hasValidResume ? this.getFileExtensionFromUrl(resumeUrl) : 'pdf';
      const downloadFileName = this.generateSafeFilename(user.name || 'User', resumeFileExtension);
      let localResumeFileName = null;
      let downloadUrl = resumeUrl;

      if (hasValidResume) {
        // Download and save resume locally
        try {
          localResumeFileName = await this.downloadAndSaveResume(resumeUrl, downloadFileName);
          
          if (localResumeFileName) {
            // Create URL to serve the local file
            downloadUrl = `${process.env.BACKEND_URL || 'https://api.crackoffcampus.com'}/api/v1/session/booking/resume/${localResumeFileName}`;
            console.log(`Resume downloaded and saved locally: ${localResumeFileName}`);
          } else {
            console.log('Failed to download resume, falling back to original URL');
            // Keep the original downloadUrl format for fallback
            downloadUrl = `${process.env.BACKEND_URL || 'https://api.crackoffcampus.com'}/api/v1/resume-upload/download?resumeUrl=${encodeURIComponent(resumeUrl)}&fileName=${encodeURIComponent(downloadFileName)}`;
          }
        } catch (error) {
          console.error('Error downloading resume:', error);
          // Fall back to original URL format if download fails
          downloadUrl = `${process.env.BACKEND_URL || 'https://api.crackoffcampus.com'}/api/v1/resume-upload/download?resumeUrl=${encodeURIComponent(resumeUrl)}&fileName=${encodeURIComponent(downloadFileName)}`;
        }
      }

      console.log("=== RESUME VALIDATION ===");
      console.log("hasValidResume:", hasValidResume);
      console.log("resumeUrl:", resumeUrl);
      console.log("resumeFileExtension:", resumeFileExtension);
      console.log("downloadFileName:", downloadFileName);
      console.log("localResumeFileName:", localResumeFileName);
      console.log("downloadUrl:", downloadUrl);
      console.log("=== END VALIDATION ===");// User email
      const userHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 20px;">Slot Booking Confirmation</h2>
            <p>Dear ${user.name || 'User'},</p>
            <p>Your slot has been booked successfully for <b>${service_name}</b> on <b>${date} at ${time}</b>.</p>            ${hasValidResume ? `
            <div style="margin: 20px 0; padding: 15px; background-color: #f0f8ff; border-radius: 5px; border-left: 4px solid #667eea;">
              <p style="margin: 0 0 10px 0; font-weight: bold; color: #333;">📄 Your Resume:</p>
              <a href="${downloadUrl}" 
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
              <a href="${downloadUrl}" 
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
      });    } catch (err: any) {
      console.error("=== BOOKING ERROR DETAILS ===");
      console.error("Error message:", err.message);
      console.error("Error name:", err.name);
      console.error("Error stack:", err.stack);
      console.error("Request body:", req.body);
      console.error("Request user:", req.user);
      console.error("=== END ERROR DETAILS ===");
      
      logger.error("Booking error:", {
        message: err.message,
        name: err.name,
        stack: err.stack,
        requestBody: req.body,
        requestUser: req.user
      });
      
      // Provide more specific error messages
      let errorMessage = "Something went wrong";
      let errorCode = "UNKNOWN_ERROR";
      
      if (err.name === 'ValidationError') {
        errorMessage = "Invalid data provided";
        errorCode = "VALIDATION_ERROR";
      } else if (err.name === 'SequelizeUniqueConstraintError') {
        errorMessage = "Slot already booked or duplicate booking";
        errorCode = "DUPLICATE_BOOKING";
      } else if (err.name === 'SequelizeDatabaseError') {
        errorMessage = "Database error occurred";
        errorCode = "DATABASE_ERROR";
      } else if (err.message.includes('User not found')) {
        errorMessage = "User not found";
        errorCode = "USER_NOT_FOUND";
      } else if (err.message.includes('Service not found')) {
        errorMessage = "Service not found";
        errorCode = "SERVICE_NOT_FOUND";
      }
      
      res.status(500).json({
        success: false,
        message: errorMessage,
        errorCode,
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
        details: process.env.NODE_ENV === "development" ? {
          name: err.name,
          stack: err.stack
        } : undefined
      });    }
  };

  // Test method without authentication - REMOVE IN PRODUCTION
  bookSlotTest = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log("=== TEST BOOKING REQUEST DEBUG ===");
      console.log("req.body:", req.body);
      console.log("=== END TEST DEBUG ===");
      
      const { serviceId, date, service_name, time, resumeUrl, payment_status, email, name } = req.body;
      
      // For testing, create a mock user from the request data
      if (!email || !name) {
        res.status(400).json({
          success: false,
          message: "Please provide email and name for test booking",
          errorCode: "MISSING_USER_DATA"
        });
        return;
      }
      
      // Find or create user for testing
      let user = await User.findOne({ where: { email } });
      if (!user) {
        res.status(400).json({
          success: false,
          message: "User not found. Please register first or use existing user credentials.",
          errorCode: "USER_NOT_FOUND"
        });
        return;
      }
      
      logger.info("Test booking with user:", user.id, email);
      
      // Validate input
      if (!serviceId || !date || !time) {
        res.status(400).json({
          success: false,
          message: "Please provide service_id, date, and time",
          errorCode: "MISSING_REQUIRED_FIELDS"
        });
        return;
      }

      // Validate payment_status if provided
      const validPaymentStatuses = ['pending', 'completed', 'failed'];
      let validatedPaymentStatus = payment_status;
      
      if (payment_status) {
        if (payment_status === 'paid') {
          validatedPaymentStatus = 'completed';
          console.log("Converting payment_status from 'paid' to 'completed'");
        } else if (!validPaymentStatuses.includes(payment_status)) {
          res.status(400).json({
            success: false,
            message: `Invalid payment_status. Must be one of: ${validPaymentStatuses.join(', ')}`,
            errorCode: "INVALID_PAYMENT_STATUS"
          });
          return;
        }
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
          errorCode: "SLOT_ALREADY_BOOKED"
        });
        return;
      }

      console.log("=== CREATING TEST BOOKING WITH DATA ===");
      const bookingData = {
        userId: user.id,
        service_id: serviceId,
        service_name: service_name,
        date,
        time,
        resume_url: resumeUrl || null,
        cancelled: false,
        payment_status: validatedPaymentStatus || 'pending'
      };
      console.log("Test booking data:", bookingData);
      console.log("=== END TEST BOOKING DATA ===");

      const booking = await SessionBooking.create(bookingData);

      // Format booking for response
      res.status(201).json({
        success: true,
        message: "Test slot booked successfully",
        booking: {
          ...booking.toJSON(),
          date: booking.date ? new Date(booking.date).toISOString().slice(0, 10) : null,
          time: booking.time ? booking.time.slice(0, 5) : null,
        },
      });
    } catch (err: any) {
      console.error("=== TEST BOOKING ERROR DETAILS ===");
      console.error("Error message:", err.message);
      console.error("Error name:", err.name);
      console.error("Error stack:", err.stack);
      console.error("Request body:", req.body);
      console.error("=== END TEST ERROR DETAILS ===");
      
      logger.error("Test booking error:", {
        message: err.message,
        name: err.name,
        stack: err.stack,
        requestBody: req.body
      });
      
      // Provide more specific error messages
      let errorMessage = "Something went wrong";
      let errorCode = "UNKNOWN_ERROR";
      
      if (err.name === 'ValidationError' || err.name === 'SequelizeValidationError') {
        errorMessage = "Invalid data provided";
        errorCode = "VALIDATION_ERROR";
      } else if (err.name === 'SequelizeUniqueConstraintError') {
        errorMessage = "Slot already booked or duplicate booking";
        errorCode = "DUPLICATE_BOOKING";
      } else if (err.name === 'SequelizeDatabaseError') {
        errorMessage = "Database error occurred";
        errorCode = "DATABASE_ERROR";
      }
      
      res.status(500).json({
        success: false,
        message: errorMessage,
        errorCode,
        error: err.message,
        details: {
          name: err.name,
          stack: err.stack
        }
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
