"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../config/db"));
const sequelize_1 = require("sequelize");
const user_model_1 = __importDefault(require("./user.model"));
class Transactions extends sequelize_1.Model {
}
Transactions.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    user_id: {
        type: sequelize_1.DataTypes.UUID,
        references: {
            model: user_model_1.default,
            key: "id",
        },
    },
    status: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    method: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    captured: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    razorpay_payment_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    razorpay_order_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    razorpay_signature: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    amount: {
        type: sequelize_1.DataTypes.DECIMAL,
        allowNull: false,
    },
    currency: {
        type: sequelize_1.DataTypes.ENUM('USD', 'INR', 'GBP', 'BTC'),
        defaultValue: "INR"
    }
}, {
    sequelize: db_1.default,
    modelName: "transactions",
    tableName: "transactions",
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
exports.default = Transactions;
