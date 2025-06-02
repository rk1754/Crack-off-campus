import { Sequelize } from "sequelize";
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from "./config";
import logger from "../utils/logger";
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: "postgres",
    logging: logger.info.bind(logger),
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false, // set to true if you have a valid CA cert
        },
    },
});

export default sequelize;
