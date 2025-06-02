"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
const admin_model_1 = __importDefault(require("./admin.model"));
class Resume extends sequelize_1.Model {
}
;
Resume.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    admin_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: admin_model_1.default,
            key: "id",
        }
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: sequelize_1.DataTypes.ENUM("resume", "cv", "referral", "cold_mail", "linkedin", "hr_contact", "roadmap", "project", "interview"),
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    template_url: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    template_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    updated_at: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    }
}, {
    sequelize: db_1.default,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    modelName: "resume_templates",
    tableName: "resume_templates",
});
exports.default = Resume;
