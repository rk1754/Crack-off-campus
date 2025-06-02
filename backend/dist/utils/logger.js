"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const path_1 = __importDefault(require("path"));
const logger = (0, winston_1.createLogger)({
    level: "info",
    format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.errors({ stack: true }), winston_1.format.splat(), winston_1.format.json()),
    transports: [
        new winston_1.transports.File({ filename: path_1.default.join(__dirname, "../../logs/error.log"), level: "error" }),
        new winston_1.transports.File({ filename: path_1.default.join(__dirname, "../../logs/combined.log") }),
    ],
});
logger.add(new winston_1.transports.Console({
    format: winston_1.format.simple(),
}));
exports.default = logger;
