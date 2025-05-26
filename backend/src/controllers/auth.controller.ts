import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { BCRYPT_SALT, JWT_EXPIRES_IN, JWT_SECRET } from "../config/config";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import cloudinary from "../config/cloudinary";
import { transporter } from "../utils/mailer";

class AuthController {
  signup = async (req: Request, res: Response): Promise<void> => {
    const data = req.body;
    if (!data.email || !data.password || !data.phone_number) {
      res.status(400).json({
        success: false,
        message: "Please provide complete data to register",
      });
      return;
    }

    try {
      const hashedPassword = await bcrypt.hash(data.password, BCRYPT_SALT);
      data.password = hashedPassword;
      const user = await User.create({
        ...data,
        role: "user",
        subscription_type: "regular",
        provider: "manual",
      });

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          subscription_type: user.subscription_type,
        },
        JWT_SECRET,
        {
          expiresIn: "2d",
        }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(201).json({
        success: true,
        user,
        token,
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

  login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
      return;
    }

    try {
      const user = await User.findOne({
        where: {
          email,
        },
      });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
        return;
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          subscription_type: user.subscription_type,
        },
        JWT_SECRET,
        {
          expiresIn: "2d",
        }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        success: true,
        user,
        token,
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

  logout = (req: Request, res: Response): void => {
    res.clearCookie("token");
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  };

  getCurrentUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const token = req.cookies.token;
      if (!token) {
        res.status(401).json({
          success: false,
          message: "Not authenticated",
        });
        return;
      }

      const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
      const user = await User.findByPk(decoded.id);

      if (!user) {
        res.status(404).json({
          success: false,
          message: "User not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        user,
      });
    } catch (err) {
      console.error(err);

      res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  };

  findAllUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await User.findAll({
        where: {
          role: "user",
        },
      });

      if (!users) {
        res.status(404).json({
          success: false,
          message: "No users found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        users,
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

  forgotPassword = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        success: false,
        message: "Please provide an email address",
      });
      return;
    }

    try {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        res.status(404).json({
          success: false,
          message: "User with this email does not exist",
        });
        return;
      }

      const resetToken = jwt.sign({ id: user.id }, JWT_SECRET, {
        expiresIn: "1h",
      });

      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
      

      await transporter.sendMail({
        from: process.env.SMTP_FROM_EMAIL,
        to: user.email,
        subject: "Password Reset Request",
        html: `
                    <p>Hello ${user.name},</p>
                    <p>You requested to reset your password. Click the link below to reset it:</p>
                    <a href="${resetLink}">${resetLink}</a>
                    <p>If you did not request this, please ignore this email.</p>
                `,
      });

      res.status(200).json({
        success: true,
        message: "Password reset email sent successfully",
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Something went wrong while sending the email",
      });
    }
  };

  resetPassword = async (req: Request, res: Response): Promise<void> => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      res.status(400).json({
        success: false,
        message: "Token and new password are required",
      });
      return;
    }

    try {
      // Verify the token
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

      const user = await User.findByPk(decoded.id);

      if (!user) {
        res.status(404).json({
          success: false,
          message: "Invalid or expired token",
        });
        return;
      }

      const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_SALT);

      user.password = hashedPassword;
      await user.save();

      res.status(200).json({
        success: true,
        message: "Password reset successfully",
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Something went wrong while resetting the password",
      });
    }
  };

  fetchMe = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log(req.user);
      const user = await User.findByPk(req.user?.id);
      if (!user) {
        res.status(404).json({
          success: false,
          message: "User not found",
        });
        return;
      }
      res.status(200).json({
        success: true,
        user,
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
  uploadProfileImage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.log("Printing before try");
    try {
      console.log("Printing after try");
      if (!req.file) {
        res.status(400).json({
          message: "No file uploaded",
        });
        return;
      }

      const base64 = `data:${
        req.file.mimetype
      };base64,${req.file.buffer.toString("base64")}`;

      const result = await cloudinary.uploader.upload(base64, {
        folder: "job-portal/profiles",
      });
      const user = req.user as User;
      console.log(user);
      if (!user) {
        res.status(403).json({
          success: false,
          message: "Please login first",
        });
        return;
      }

      await User.update(
        { profile_pic: result.secure_url },
        {
          where: {
            id: user.id,
          },
        }
      );

      res.status(200).json({
        imageUrl: result.secure_url,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: "Upload failed",
      });
    }
  };

  uploadCoverImage = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
        return;
      }
      const base64 = `data:${
        req.file.mimetype
      };base64,${req.file.buffer.toString("base64")}`;

      const result = await cloudinary.uploader.upload(base64, {
        folder: "job-portal/covers",
      });
      const user = req.user as User;
      if (!user) {
        res.status(403).json({
          success: false,
          message: "Please login first",
        });
        return;
      }

      await User.update(
        { cover_image: result.secure_url },
        {
          where: {
            id: user.id,
          },
        }
      );
      res.status(200).json({
        cover_image: result.secure_url,
      });

      return;
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Failed to upload cover page",
      });
    }
  };
  addSkills = async (req: Request, res: Response): Promise<void> => {
    try {
      const skills = req.body.skills;
      const user = req.user as User;
      if (!user) {
        res.status(403).json({
          success: false,
          message: "Please login first",
        });
        return;
      }
      console.log(user);
      if (!skills || !Array.isArray(skills)) {
        res.status(400).json({
          success: false,
          message: "Please provide correct data",
        });
        return;
      }

      await User.update(
        { skills: skills },
        {
          where: {
            id: user.id,
          },
        }
      );
      res.status(200).json({
        success: true,
        message: "Skills addded successfully",
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

  fetchUserById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({
          success: false,
          message: "Please provide id",
        });
        return;
      }

      const user = await User.findByPk(id);
      res.status(200).json({
        success: true,
        user,
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

  updateMe = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = req.body;
      const user = await User.findByPk(req.user?.id);
      if (!user) {
        res.status(404).json({ success: false, message: "User not found" });
        return;
      }

      if (data.skills !== undefined && typeof data.skills === "string") {
        try {
          data.skills = JSON.parse(data.skills);
        } catch {
          data.skills = data.skills
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean);
        }
      }

      if (req.files && (req.files as any).profile_pic) {
        const file = (req.files as any).profile_pic[0];
        const base64 = `data:${file.mimetype};base64,${file.buffer.toString(
          "base64"
        )}`;
        const result = await cloudinary.uploader.upload(base64, {
          folder: "job-portal/profiles",
        });
        data.profile_pic = result.secure_url;
      }

      if (req.files && (req.files as any).cover_image) {
        const file = (req.files as any).cover_image[0];
        const base64 = `data:${file.mimetype};base64,${file.buffer.toString(
          "base64"
        )}`;
        const result = await cloudinary.uploader.upload(base64, {
          folder: "job-portal/covers",
        });
        data.cover_image = result.secure_url;
      }

      await user.update(data);
      const updatedUser = await User.findByPk(user.id);
      res.status(200).json({ success: true, user: updatedUser });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Something went wrong" });
    }
  };
  setUserPremium = async(req : Request, res : Response):Promise<void>=>{
    try{
      const user = req.user;
      if(!user){
        res.status(403).json({
          success: false,
          message: "Please login first",
        });
        return;
      }

      await User.update({
        subscription_type: "booster",
      }, {
        where : {
          id : user.id
        }
      });

      res.clearCookie("token");
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          subscription_type: "booster",
        },
        JWT_SECRET,
        {
          expiresIn: "2d",
        }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.status(200).json({
        success : true
      });
    }catch(err){
      console.error(err);
      res.status(500).json({
        success: false,

        message: "Something went wrong",
      });
      return;
    }
  }
  deleteMe = async (req: Request, res: Response): Promise<void> => {
    try {
      await User.destroy({
        where: { id: req.user?.id },
      });
      res.status(200).json({
        success: true,
        message: "User deleted successfully",
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
}

export default AuthController;
