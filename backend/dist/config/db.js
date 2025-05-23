"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = require("./config");
const sequelize = new sequelize_1.Sequelize(config_1.DB_NAME, config_1.DB_USER, config_1.DB_PASSWORD, {
    host: config_1.DB_HOST,
    port: config_1.DB_PORT,
    dialect: "postgres",
    logging: console.log,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false, // set to true if you have a valid CA cert
        },
    },
});
exports.default = sequelize;
