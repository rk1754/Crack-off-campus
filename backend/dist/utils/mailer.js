"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = require("../config/config");
exports.transporter = nodemailer_1.default.createTransport({
    host: config_1.SMTP_HOST,
    port: config_1.SMTP_PORT,
    secure: true,
    auth: {
        user: config_1.SMTP_USER,
        pass: config_1.SMTP_PASSWORD
    },
    logger: true,
    debug: true,
});
