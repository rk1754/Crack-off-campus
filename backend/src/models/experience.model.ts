import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import {differenceInMonths} from "date-fns"
import User from "./user.model";

class Experience extends Model{
    public id!: string;
    public job_title!: string;
    public start_date!: Date;
    public end_date !: Date;
    public company_name!: string;
    public location!: string;
    public description! : string;
    public employment_type !: string;
}

Experience.init({
    id : {
        type : DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4,
        primaryKey : true,
    },
    user_id : {
        type : DataTypes.UUID,
        references : {
            model : User,
            key : "id"
        },
        allowNull : false,
    },
    job_title : {
        type : DataTypes.STRING,
        allowNull : false,
    },
    company_name : {
        type : DataTypes.STRING,
        allowNull : false,
    },
    experience_duration : {
        type : DataTypes.VIRTUAL,
        get(){
            const start = this.getDataValue('start_date');
            const end = this.getDataValue('end_date');
            if(!start) return null;
            const months = differenceInMonths(new Date(end), new Date(start));
            const years = Math.floor(months / 12);
            const remainingMonths = months % 12;

            return `${years} years ${remainingMonths} months`;
        },
    },
    start_date : {
        type : DataTypes.DATE,
        allowNull : false,
    },
    end_date : {
        type : DataTypes.DATE,
    },
    location : {
        type : DataTypes.STRING,
        allowNull : false,
    },
    description : {
        type : DataTypes.TEXT,
        allowNull : true,
    },
    employment_type :{
        type : DataTypes.ENUM('internship', 'full_time'),
        allowNull : false
    },
},{
    sequelize,
    modelName : "experience",
    tableName : "experience"
});

export default Experience;