"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = require("./config");
const logger_1 = __importDefault(require("../utils/logger"));
const sequelize = new sequelize_1.Sequelize(config_1.DB_NAME, config_1.DB_USER, config_1.DB_PASSWORD, {
    host: config_1.DB_HOST,
    port: config_1.DB_PORT,
    dialect: "postgres",
    logging: logger_1.default.info.bind(logger_1.default),
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false, // set to true if you have a valid CA cert
        },
    },
});
exports.default = sequelize;
