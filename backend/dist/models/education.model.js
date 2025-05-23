"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
const user_model_1 = __importDefault(require("./user.model"));
class Education extends sequelize_1.Model {
}
Education.init({
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
    education: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    start_year: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    end_year: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
    }
}, {
    sequelize: db_1.default,
    modelName: "education",
    tableName: "education"
});
exports.default = Education;
