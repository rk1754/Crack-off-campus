import { configDotenv } from "dotenv";

configDotenv();

export const PORT = parseInt(process.env.PORT as string);

// DB Creds done
export const DB_NAME:string = process.env.DB_NAME as string;
export const DB_USER:string = process.env.DB_USER as string;
export const DB_PASSWORD:string = process.env.DB_PASSWORD as string;
export const DB_PORT:number = parseInt(process.env.DB_PORT as string);
export const DB_HOST:string = process.env.DB_HOST as string;

// Google ID Done
export const GOOGLE_CLIENT_ID:string = process.env.GOOGLE_CLIENT_ID!;
export const GOOGLE_CLIENT_SECRET:string = process.env.GOOGLE_CLIENT_SECRET!;

// Session Secret Done
export const JWT_SECRET:string = process.env.JWT_SECRET as string;
export const JWT_EXPIRES_IN:string = process.env.JWT_EXPIRES_IN as string;

// Bcrypt Salt Set
export const BCRYPT_SALT:number = parseInt(process.env.BCRYPT_SALT as string);

// SMTP Not Set
export const SMTP_HOST:string = process.env.SMTP_HOST as string;
export const SMTP_PORT:number = parseInt(process.env.SMTP_PORT as string);
export const SMTP_USER:string = process.env.SMTP_USER as string;
export const SMTP_PASSWORD:string = process.env.SMTP_PASSWORD as string;

// Razorpay Not Set
export const RAZORPAY_KEY_ID:string = process.env.RAZORPAY_KEY_ID as string;
export const RAZORPAY_KEY_SECRET:string = process.env.RAZORPAY_KEY_SECRET as string;

// Cloudinary Config
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME as string;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY as string;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET as string;

