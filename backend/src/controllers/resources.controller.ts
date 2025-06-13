import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import logger from "../utils/logger";

class ResourcesController {
  // Helper method to check if user has access to a resource
  private checkResourceAccess(user: any, resourceType: string): boolean {
    if (!user) return false;
    
    // Check if user has the specific resource boolean flag
    return user[resourceType] === true;
  }

  // Helper method to send file
  private sendFile(res: Response, filePath: string, fileName: string) {
    const absolutePath = path.join(__dirname, "..", "static", "templates", filePath);
    
    // Check if file exists
    if (!fs.existsSync(absolutePath)) {
      logger.error(`Template file not found: ${absolutePath}`);
      res.status(404).json({
        success: false,
        message: "Template file not found"
      });
      return;
    }

    // Set headers for download
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', 'application/pdf');
    
    // Send file
    res.sendFile(absolutePath, (err) => {
      if (err) {
        logger.error(`Error sending file: ${err.message}`);
        if (!res.headersSent) {
          res.status(500).json({
            success: false,
            message: "Error downloading file"
          });
        }
      } else {
        logger.info(`File downloaded successfully: ${fileName}`, {
          user_id: res.locals.user?.id,
          resource: fileName
        });
      }
    });
  }

  downloadResumeTemplate = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user;
      
      if (!this.checkResourceAccess(user, 'resume')) {
        res.status(403).json({
          success: false,
          message: "Access denied. Please purchase this resource first."
        });
        return;
      }

      this.sendFile(res, "resume_template.pdf", "resume_template.pdf");
    } catch (error: any) {
      logger.error("Error downloading resume template", {
        error: error.message,
        user_id: req.user?.id
      });
      res.status(500).json({
        success: false,
        message: "Server error"
      });
    }
  };

  downloadReferralTemplate = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user;
      
      if (!this.checkResourceAccess(user, 'referral')) {
        res.status(403).json({
          success: false,
          message: "Access denied. Please purchase this resource first."
        });
        return;
      }

      this.sendFile(res, "referral_template.pdf", "referral_template.pdf");
    } catch (error: any) {
      logger.error("Error downloading referral template", {
        error: error.message,
        user_id: req.user?.id
      });
      res.status(500).json({
        success: false,
        message: "Server error"
      });
    }
  };

  downloadColdMailTemplate = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user;
      
      if (!this.checkResourceAccess(user, 'cold_mail')) {
        res.status(403).json({
          success: false,
          message: "Access denied. Please purchase this resource first."
        });
        return;
      }

      this.sendFile(res, "cold_mail_template.pdf", "cold_mail_template.pdf");
    } catch (error: any) {
      logger.error("Error downloading cold mail template", {
        error: error.message,
        user_id: req.user?.id
      });
      res.status(500).json({
        success: false,
        message: "Server error"
      });
    }
  };

  downloadCoverLetterTemplate = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user;
      
      if (!this.checkResourceAccess(user, 'cover_letter')) {
        res.status(403).json({
          success: false,
          message: "Access denied. Please purchase this resource first."
        });
        return;
      }

      this.sendFile(res, "cover_letter_template.pdf", "cover_letter_template.pdf");
    } catch (error: any) {
      logger.error("Error downloading cover letter template", {
        error: error.message,
        user_id: req.user?.id
      });
      res.status(500).json({
        success: false,
        message: "Server error"
      });
    }
  };

  downloadHrEmailTemplate = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user;
      
      if (!this.checkResourceAccess(user, 'hr_mail')) {
        res.status(403).json({
          success: false,
          message: "Access denied. Please purchase this resource first."
        });
        return;
      }

      this.sendFile(res, "hr_email_template.pdf", "hr_email_template.pdf");
    } catch (error: any) {
      logger.error("Error downloading HR email template", {
        error: error.message,
        user_id: req.user?.id
      });
      res.status(500).json({
        success: false,
        message: "Server error"
      });
    }
  };
}

export default new ResourcesController();
