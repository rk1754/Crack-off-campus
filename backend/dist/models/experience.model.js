"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
const date_fns_1 = require("date-fns");
const user_model_1 = __importDefault(require("./user.model"));
class Experience extends sequelize_1.Model {
}
Experience.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    user_id: {
        type: sequelize_1.DataTypes.UUID,
        references: {
            model: user_model_1.default,
            key: "id"
        },
        allowNull: false,
    },
    job_title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    company_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    experience_duration: {
        type: sequelize_1.DataTypes.VIRTUAL,
        get() {
            const start = this.getDataValue('start_date');
            const end = this.getDataValue('end_date');
            if (!start)
                return null;
            const months = (0, date_fns_1.differenceInMonths)(new Date(end), new Date(start));
            const years = Math.floor(months / 12);
            const remainingMonths = months % 12;
            return `${years} years ${remainingMonths} months`;
        },
    },
    start_date: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    end_date: {
        type: sequelize_1.DataTypes.DATE,
    },
    location: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    employment_type: {
        type: sequelize_1.DataTypes.ENUM('internship', 'full_time'),
        allowNull: false
    },
}, {
    sequelize: db_1.default,
    modelName: "experience",
    tableName: "experience"
});
exports.default = Experience;
