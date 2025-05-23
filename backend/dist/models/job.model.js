"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
const admin_model_1 = __importDefault(require("./admin.model"));
class Jobs extends sequelize_1.Model {
}
Jobs.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        defaultValue: sequelize_1.UUIDV4
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    location: {
        type: sequelize_1.DataTypes.STRING,
    },
    company_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    ctc_stipend: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    experience: {
        type: sequelize_1.DataTypes.ENUM("fresher", "experienced"),
        allowNull: true,
    },
    job_url: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    employment_type: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    passout_year: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    admin_id: {
        type: sequelize_1.DataTypes.UUID,
        references: {
            model: admin_model_1.default,
            key: "id"
        }
    },
    remote: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: true,
    },
    subscription_type: {
        type: sequelize_1.DataTypes.ENUM('gold', 'gold_plus', 'diamond', 'regular'),
        defaultValue: 'regular'
    },
    requirements: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
        allowNull: true,
    },
    benefits: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
        allowNull: true,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('open', 'closed'),
        defaultValue: 'open'
    },
    search_vector: {
        type: sequelize_1.DataTypes.TSVECTOR,
        allowNull: true,
    },
    skills: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
        allowNull: true,
    },
}, {
    sequelize: db_1.default,
    modelName: "jobs",
    tableName: "jobs",
    timestamps: true,
    createdAt: 'posted_at',
    updatedAt: 'updated_at',
    indexes: [
        {
            fields: ['title'],
        },
        {
            fields: ['location'],
        },
        {
            fields: ['search_vector'],
            using: "GIN",
        }
    ]
});
exports.default = Jobs;
