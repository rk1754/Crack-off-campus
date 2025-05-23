import { Model, DataTypes, Sequelize } from "sequelize";
import sequelize from "../config/db"; 

class Session extends Model {
    public id!: string;
    public admin_id!: string; 
    public time!: Date; 
    public title!: string;
    public description!: string;
    public meeting_duration!: number;
    public service_description!:string;
    public ratings!: number; 
    public image_url?:string;
    public isBooked!: boolean;
    public price!: number; 
    public createdAt!: Date;
    public updatedAt!: Date;
}

Session.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        admin_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        time: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        meeting_duration: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        ratings: {
            type: DataTypes.FLOAT,
            defaultValue: 0,
        },
        isBooked: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        image_url : {
            type : DataTypes.STRING,
            allowNull : true,
        }
    },
    {
        sequelize, 
        modelName: "session",
        tableName: "session",
        timestamps: true, 
    }
);

// (No changes needed, but this model is no longer used for booking logic.)

export default Session;