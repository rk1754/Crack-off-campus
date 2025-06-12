import nodemailer from "nodemailer";
import {SMTP_HOST, SMTP_PASSWORD, SMTP_PORT, SMTP_USER} from "../config/config";

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


export const transporter = nodemailer.createTransport({
    pool: true,
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: true,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD,
    },
    maxConnections: 10, // Increased for faster processing
    maxMessages: 100,   // Process more messages per connection
    rateDelta: 1000,    // 1 second rate limiting
    rateLimit: 10,      // Increased to 10 emails per rateDelta for faster delivery
    logger: false,      // Disable logging for faster performance
    debug: false,       // Disable debug for faster performance
    connectionTimeout: 2000,  // 2 seconds timeout
    greetingTimeout: 2000,    // 2 seconds greeting timeout
    socketTimeout: 5000,      // 5 seconds socket timeout
    // Additional optimizations
    opportunisticTLS: true,   // Use TLS when available
    requireTLS: true,         // Require TLS for security
    tls: {
        rejectUnauthorized: false // For compatibility with some SMTP servers
    }
});
