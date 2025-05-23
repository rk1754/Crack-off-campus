import nodemailer from "nodemailer";
import {SMTP_HOST, SMTP_PASSWORD, SMTP_PORT, SMTP_USER} from "../config/config";

export const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port : SMTP_PORT,
    secure : true,
    auth : {
        user : SMTP_USER,
        pass : SMTP_PASSWORD
    },
    logger : true,
    debug : true,
});
