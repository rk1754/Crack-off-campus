import { configDotenv } from "dotenv";

configDotenv();

export const PORT = parseInt(process.env.PORT as string) || 5454;

// DB Creds
export const DB_NAME: string = process.env.DB_NAME || "";
export const DB_USER: string = process.env.DB_USER || "";
export const DB_PASSWORD: string = process.env.DB_PASSWORD || "";
export const DB_PORT: number = parseInt(process.env.DB_PORT as string) || 5432;
export const DB_HOST: string = process.env.DB_HOST || "";

// Google ID
export const GOOGLE_CLIENT_ID: string = process.env.GOOGLE_CLIENT_ID || "";
export const GOOGLE_CLIENT_SECRET: string = process.env.GOOGLE_CLIENT_SECRET || "";

// Session Secret
export const JWT_SECRET: string = process.env.JWT_SECRET || "changeme";
export const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || "2d";

// Bcrypt Salt
export const BCRYPT_SALT: number = parseInt(process.env.BCRYPT_SALT as string) || 10;

// SMTP
export const SMTP_HOST: string = process.env.SMTP_HOST || "";
export const SMTP_PORT: number = parseInt(process.env.SMTP_PORT as string) || 465;
export const SMTP_USER: string = process.env.SMTP_USER || "";
export const SMTP_PASSWORD: string = process.env.SMTP_PASSWORD || "";

// Razorpay
export const RAZORPAY_KEY_ID: string = process.env.RAZORPAY_KEY_ID || "";
export const RAZORPAY_KEY_SECRET: string = process.env.RAZORPAY_KEY_SECRET || "";

// Cloudinary Config
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "";
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || "";
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || "";

// Frontend URL for CORS and password reset links
export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:8080";

