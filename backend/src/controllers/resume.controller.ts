import { Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import Resume from "../models/resume.model";
import axios from "axios";
import archiver from "archiver";
import User from "../models/user.model";

async function listFilesinCloudinary(){
  try{
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: "job-portal/resume_templates",
      max_results: 30,
    });

    return result.resources;
  }catch(err){
    console.error(err);
    throw err;
  }
}

class ResumeController {
  uploadResume = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
        return;
      }
      const file = req.file;
      const { name, description, type } = req.body;
      if (!name || !description || !type) {
        res.status(400).json({
          success: false,
          message: "Name and description are required",
        });
        return;
      }

      const base64 = `data:${file.mimetype};base64,${file.buffer.toString(
        "base64"
      )}`;

      const result = await cloudinary.uploader.upload(base64, {
        folder: "job-portal/resume_templates",
        resource_type: "raw",
      });
      if (!result) {
        res.status(500).json({
          success: false,
          message: "Something went wrong while uploading the file",
        });
        return;
      }

      const admin = req.admin;
      if (!admin) {
        res.status(403).json({
          success: false,
          message: "You are not allowed to upload this template",
        });
        return;
      }

      const resume = await Resume.create({
        name,
        description,
        template_url: result.secure_url,
        template_id: result.public_id,
        admin_id: admin.id,
        type,
      });

      res.status(201).json({
        success: true,
        message: "Resume template uploaded successfully",
        resume,
      });

      return;
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
      return;
    }
  };

  getAllTemplates = async (req: Request, res: Response): Promise<void> => {
    try {
      const templates = await Resume.findAll();
      if (!templates) {
        res.status(404).json({
          success: false,
          message: "No templates found",
        });
        return;
      }
      const user = req.user;
      if(!user || user.subscription_type !== "booster" && user.subscription_type !== "standard" && user.subscription_type !== "basic"){
        res.status(403).json({
          success: false,
          message: "You are not allowed to view this template",
        });
        return;
      }
      res.status(200).json({
        success: true,
        message: "Templates fetched successfully",
        templates,
      });
      return;
    } catch (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
      return;
    }
  };

  getAllTemplatesAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
      const templates = await Resume.findAll();
      if (!templates) {
        res.status(404).json({
          success: false,
          message: "No templates found",
        });
        return;
      }
      const admin = req.admin;

      if(!admin){
        res.status(403).json({
          success: false,
          message: "You are not allowed to view this template",
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: "Templates fetched successfully",
        templates,
      });
      return;
    } catch (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
      return;
    }
  };

  downloadTemplate = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user;
      if (
        !user ||
        (user.subscription_type !== "booster" &&
          user.subscription_type !== "standard" &&
          user.subscription_type !== "basic" &&
          user.subscription_type !== "resume" &&
          user.subscription_type !== "other_templates")
      ) {
        res.status(403).json({
          success: false,
          message: "You are not allowed to download this template",
        });
        return;
      }

      const templateId = req.params.id;
      const template = await Resume.findOne({
        where: {
          id: templateId,
        },
      });

      if (!template) {
        res.status(404).json({
          success: false,
          message: "Template not found \n Sorry for the inconsistency",
        });
        return;
      }

      // Subscription logic based on template type
      if (
        (template.type === "resume" &&
          user.subscription_type !== "booster" &&
          user.subscription_type !== "standard" &&
          user.subscription_type !== "basic" &&
          user.subscription_type !== "resume")
      ) {
        res.status(403).json({
          success: false,
          message: "You are not allowed to download this resume template",
        });
        return;
      }

      if (
        template.type === "other_templates" &&
        user.subscription_type !== "other_templates"
      ) {
        res.status(403).json({
          success: false,
          message: "You are not allowed to download this template",
        });
        return;
      }

      const url = cloudinary.url(template.template_url, {
        secure: true,
        attachment: true,
        resource_type: "raw",
      });

      res.status(200).json({
        success: true,
        url,
      });
      return;
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
      return;
    }
  };

  downloadAllTemplates = async (req: Request, res: Response): Promise<void> => {
    try {
      const templates = await Resume.findAll({
        attributes: ["template_url", "template_id"],
      });
  
      if (!templates || templates.length === 0) {
        res.status(404).json({ success: false, message: "No templates found" });
        return;
      }
  
      // ✅ 2. Set headers for zip download
      res.setHeader("Content-Type", "application/zip");
      res.setHeader("Content-Disposition", "attachment; filename=templates.zip");
  
      const archive = archiver("zip", { zlib: { level: 9 } });
  
      archive.on("error", (err) => {
        throw err;
      });
  
      archive.pipe(res);
  
      // ✅ 3. Download each file and add to the zip
      for (const template of templates) {
        const url = template.template_url;
        const response = await axios.get(url, { responseType: "stream" });
  
        const fileExtension = url.split('.').pop()?.split('?')[0] || "pdf";
        const fileName = `${template.template_id}.${fileExtension}`;
        archive.append(response.data, { name: fileName });
      }
  
      await archive.finalize();
    } catch (err) {
      console.error("Error downloading templates:", err);
      res.status(500).json({
        success: false,
        message: "Something went wrong while zipping files",
      });
    }
  };


  downloadTemplateAdmin = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const admin = req.admin;
      if (!admin) {
        res.status(403).json({
          success: false,
          message: "You are not allowed to download this template",
        });
        return;
      }

      const templateId = req.params.id;
      const template = await Resume.findOne({
        where: {
          id: templateId,
        },
      });

      if (!template) {
        res.status(404).json({
          success: false,
          message: "Template not found \n Sorry for the inconsistency",
        });
        return;
      }

      const url = cloudinary.url(template.template_url, {
        secure: true,
        attachment: true,
        resource_type: "raw",
      });

      res.status(200).json({
        success: true,
        url,
      });
      return;
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
      return;
    }
  };

  updateTemplateUpload = async (req: Request, res: Response): Promise<void> => {
    try {
      const templateId = req.params.id;
      if (!req.file) {
        res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }
      const template = await Resume.findOne({
        where: {
          id: templateId,
        },
      });
      if (!template) {
        res.status(404).json({
          success: false,
          message: "Template not found",
        });
        return;
      }
      const file = req.file;
      if (!file) {
        res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
        return;
      }
      await cloudinary.api.delete_resources_by_prefix(
        `job-portal/resume_templates/${template.template_id}`,
        {
          resource_type: "raw",
        }
      );

      const base64 = `data:${file.mimetype};base64,${file.buffer.toString(
        "base64"
      )}`;
      const result = await cloudinary.uploader.upload(base64, {
        folder: "job-portal/resume_templates",
        resource_type: "raw",
      });

      template.template_id = result.public_id;
      template.template_url = result.secure_url;
      await template.save();
      res.status(200).json({
        success: true,
        message: "Template updated successfully",
        template,
      });
      return;
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
      return;
    }
  };

  deleteTemplate = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({
          success: false,
          message: "Please provide template id",
        });
        return;
      }

      const template = await Resume.findOne({
        where: {
          id,
        },
      });
      if (!template) {
        res.status(404).json({
          success: false,
          message: "Template not found",
        });
        return;
      }

      await Promise.all([
        cloudinary.api.delete_resources_by_prefix(
          `job-portal/resume_templates/${template.template_id}`,
          {
            resource_type: "raw",
          }
        ),
        template.destroy(),
      ]);

      res.status(200).json({
        success: true,
        message: "Template deleted successfully",
      });
      return;
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
      return;
    }
  };

  getTemplatesByType = async(req : Request, res : Response):Promise<void>=>{
    try{
      const type = req.params.type;
      if(!type){
        res.status(400).json({
          success: false,
          message: "Please provide template type",
        });
        return;
      }

      const templates = await Resume.findAll({
        where : {
          type
        }
      });

      if(!templates){
        res.status(404).json({
          success: false,
          message: "No templates found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Templates fetched successfully",
        templates,
      });
      return;
    }catch(err){
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  }
}

export default ResumeController;
