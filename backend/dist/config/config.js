"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLOUDINARY_API_SECRET = exports.CLOUDINARY_API_KEY = exports.CLOUDINARY_CLOUD_NAME = exports.RAZORPAY_KEY_SECRET = exports.RAZORPAY_KEY_ID = exports.SMTP_PASSWORD = exports.SMTP_USER = exports.SMTP_PORT = exports.SMTP_HOST = exports.BCRYPT_SALT = exports.JWT_EXPIRES_IN = exports.JWT_SECRET = exports.GOOGLE_CLIENT_SECRET = exports.GOOGLE_CLIENT_ID = exports.DB_HOST = exports.DB_PORT = exports.DB_PASSWORD = exports.DB_USER = exports.DB_NAME = exports.PORT = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.configDotenv)();
exports.PORT = parseInt(process.env.PORT);
// DB Creds done
exports.DB_NAME = process.env.DB_NAME;
exports.DB_USER = process.env.DB_USER;
exports.DB_PASSWORD = process.env.DB_PASSWORD;
exports.DB_PORT = parseInt(process.env.DB_PORT);
exports.DB_HOST = process.env.DB_HOST;
// Google ID Done
exports.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
exports.GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
// Session Secret Done
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
// Bcrypt Salt Set
exports.BCRYPT_SALT = parseInt(process.env.BCRYPT_SALT);
// SMTP Not Set
exports.SMTP_HOST = process.env.SMTP_HOST;
exports.SMTP_PORT = parseInt(process.env.SMTP_PORT);
exports.SMTP_USER = process.env.SMTP_USER;
exports.SMTP_PASSWORD = process.env.SMTP_PASSWORD;
// Razorpay Not Set
exports.RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
exports.RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
// Cloudinary Config
exports.CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
exports.CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
exports.CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
