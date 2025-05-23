import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import User from "./user.model";
import Admin from "./admin.model";
class SessionBooking extends Model {
    public id?: string;
    public userId!: string;
    public service_id!: string;
    public date!: string; // ISO date string
    public time!: string; // e.g. "09:00 PM"
    public meet_link?: string;
    public cancelled!: boolean;
    public payment_status!: string;
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

SessionBooking.init({
    id : {
        type : DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4,
        primaryKey : true,
    },
    userId : {
        type : DataTypes.UUID,
        references : {
            model : User,
            key : "id"
        },
        allowNull : false,
    },
    service_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    time: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    meet_link : {
        type : DataTypes.STRING,
        allowNull : true,
    },
    cancelled : {
        type : DataTypes.BOOLEAN,
        defaultValue : false,
    },
    payment_status : {
        type : DataTypes.ENUM('pending', 'completed', 'failed'),
        defaultValue : 'pending',
    },
},
{
    sequelize,
    modelName : "session_booking",
    tableName : "session_booking",
    timestamps : true
});

SessionBooking.belongsTo(User, { foreignKey: "userId" });
SessionBooking.belongsTo(Admin, { foreignKey: "admin_id" });

export default SessionBooking;