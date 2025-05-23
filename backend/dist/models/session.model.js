"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
class Session extends sequelize_1.Model {
}
Session.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    admin_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    time: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    meeting_duration: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    ratings: {
        type: sequelize_1.DataTypes.FLOAT,
        defaultValue: 0,
    },
    isBooked: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    price: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    image_url: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    }
}, {
    sequelize: db_1.default,
    modelName: "session",
    tableName: "session",
    timestamps: true,
});
// (No changes needed, but this model is no longer used for booking logic.)
exports.default = Session;
