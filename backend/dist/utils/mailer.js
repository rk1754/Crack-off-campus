"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = require("../config/config");
// export const transporter = nodemailer.createTransport({
//     host: SMTP_HOST,
//     port : SMTP_PORT,
//     secure : true,
//     auth : {
//         user : SMTP_USER,
//         pass : SMTP_PASSWORD
//     },
//     logger : true,
//     debug : true,
// });
exports.transporter = nodemailer_1.default.createTransport({
    pool: true,
    host: config_1.SMTP_HOST,
    port: config_1.SMTP_PORT,
    secure: true,
    auth: {
        user: config_1.SMTP_USER,
        pass: config_1.SMTP_PASSWORD,
    },
    maxConnections: 10, // Increased for faster processing
    maxMessages: 100, // Process more messages per connection
    rateDelta: 1000, // 1 second rate limiting
    rateLimit: 10, // Increased to 10 emails per rateDelta for faster delivery
    logger: false, // Disable logging for faster performance
    debug: false, // Disable debug for faster performance
    connectionTimeout: 2000, // 2 seconds timeout
    greetingTimeout: 2000, // 2 seconds greeting timeout
    socketTimeout: 5000, // 5 seconds socket timeout
    // Additional optimizations
    opportunisticTLS: true, // Use TLS when available
    requireTLS: true, // Require TLS for security
    tls: {
        rejectUnauthorized: false // For compatibility with some SMTP servers
    }
});
