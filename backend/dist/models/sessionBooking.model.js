"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
const user_model_1 = __importDefault(require("./user.model"));
const admin_model_1 = __importDefault(require("./admin.model"));
class SessionBooking extends sequelize_1.Model {
}
SessionBooking.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        references: {
            model: user_model_1.default,
            key: "id"
        },
        allowNull: false,
    },
    service_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    date: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    time: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    meet_link: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    cancelled: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    payment_status: {
        type: sequelize_1.DataTypes.ENUM('pending', 'completed', 'failed'),
        defaultValue: 'pending',
    },
}, {
    sequelize: db_1.default,
    modelName: "session_booking",
    tableName: "session_booking",
    timestamps: true
});
SessionBooking.belongsTo(user_model_1.default, { foreignKey: "userId" });
SessionBooking.belongsTo(admin_model_1.default, { foreignKey: "admin_id" });
exports.default = SessionBooking;
