import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import Admin from "./admin.model";

class Resume extends Model{
    public id!: string;
    public name!: string;
    public type!: string;
    public admin_id!: string;
    public description!: string;
    public template_url!: string;
    public template_id!: string;
    public readonly created_at?: Date;
    public readonly updated_at?: Date;
};


Resume.init({
    id : {
        type : DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4,
        primaryKey : true,
    },
    admin_id : {
        type : DataTypes.UUID,
        allowNull : false,
        references : {
            model : Admin,
            key : "id",
        }
    },
    name : {
        type : DataTypes.STRING,
        allowNull : false,
    },
    type : {
        type : DataTypes.ENUM("resume", "cv", "referral", "cold_mail", "linkedin", "hr_contact", "roadmap", "project", "interview"),
        allowNull : false,
    },
    description : {
        type : DataTypes.STRING,
        allowNull : false,
    },
    template_url : {
        type : DataTypes.STRING,
        allowNull : false,
    },
    template_id : {
        type : DataTypes.STRING,
        allowNull : false
    },
    created_at : {
        type : DataTypes.DATE,
        defaultValue : DataTypes.NOW,
    },
    updated_at : {
        type : DataTypes.DATE,
        defaultValue : DataTypes.NOW,
    }
},
{
    sequelize,
    timestamps : true,
    createdAt : "created_at",
    updatedAt : "updated_at",
    modelName : "resume_templates",
    tableName : "resume_templates",
});


export default Resume;