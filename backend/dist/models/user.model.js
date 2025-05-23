"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
class User extends sequelize_1.Model {
}
User.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        defaultValue: sequelize_1.UUIDV4,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    google_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    phone_number: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    is_employer: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    profile_pic: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    cover_image: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    bio: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    role: {
        type: sequelize_1.DataTypes.ENUM('user', 'admin')
    },
    skills: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
        allowNull: true,
    },
    provider: {
        type: sequelize_1.DataTypes.ENUM("manual", "google"),
        defaultValue: "manual",
    },
    subscription_type: {
        type: sequelize_1.DataTypes.ENUM('basic', 'standard', 'booster', 'regular', 'job', "resume", "other_templates"),
        defaultValue: 'regular'
    },
    subscription_expiry: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    is_premium: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    resetPasswordToken: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    resetPasswordExpires: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    updated_at: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: db_1.default,
    timestamps: true,
    modelName: "user",
    tableName: "user",
    indexes: [
        {
            fields: ["email"],
            unique: true,
        },
    ],
});
exports.default = User;
