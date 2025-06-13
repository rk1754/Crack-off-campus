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
    // Use process.cwd() to get the current working directory (backend root)
    // This works both in development and production
    const absolutePath = path.join(process.cwd(), "src", "static", "templates", filePath);
    
    // Debug logging
    console.log("Attempting to find file at:", absolutePath);
    console.log("Current working directory:", process.cwd());
    console.log("__dirname is:", __dirname);
    
    // Check if file exists
    if (!fs.existsSync(absolutePath)) {
      // Try alternative path for production (if files are in dist)
      const altPath = path.join(__dirname, "..", "..", "src", "static", "templates", filePath);
      console.log("Trying alternative path:", altPath);
      
      if (!fs.existsSync(altPath)) {
        logger.error(`Template file not found at both paths: ${absolutePath} and ${altPath}`);
        res.status(404).json({
          success: false,
          message: "Template file not found",
          debug: {
            path1: absolutePath,
            path2: altPath,
            cwd: process.cwd(),
            dirname: __dirname
          }
        });
        return;
      }
      
      // Use alternative path
      console.log("Using alternative path:", altPath);
      this.sendFileFromPath(res, altPath, fileName);
      return;
    }

    this.sendFileFromPath(res, absolutePath, fileName);
  }

  // Helper to actually send the file
  private sendFileFromPath(res: Response, absolutePath: string, fileName: string) {
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

  // Debug endpoint to check paths and files
  debugPaths = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user;
      const path1 = path.join(process.cwd(), "src", "static", "templates");
      const path2 = path.join(__dirname, "..", "..", "src", "static", "templates");
      const path3 = path.join(__dirname, "..", "static", "templates");

      // Check what files exist in each path
      const checkPath = (pathToCheck: string) => {
        try {
          if (fs.existsSync(pathToCheck)) {
            const files = fs.readdirSync(pathToCheck);
            return { exists: true, files };
          }
          return { exists: false, files: [] };        } catch (error: any) {
          return { exists: false, error: error.message, files: [] };
        }
      };

      res.json({
        success: true,
        user: user ? {
          id: user.id,
          email: user.email,
          resume: user.resume,
          referral: user.referral,
          cold_mail: user.cold_mail,
          cover_letter: user.cover_letter,
          hr_mail: user.hr_mail
        } : null,
        debug: {
          cwd: process.cwd(),
          dirname: __dirname,
          paths: {
            path1: { path: path1, ...checkPath(path1) },
            path2: { path: path2, ...checkPath(path2) },
            path3: { path: path3, ...checkPath(path3) }
          }
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
}

export default new ResourcesController();
