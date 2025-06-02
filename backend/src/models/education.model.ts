import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import User from "./user.model";

class Education extends Model{
    public id!: string;
    public education!: string;
    public start_year!: Date;
    public end_year!: Date;
    public specialization?: string;
}

Education.init({
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
    education : {
        type : DataTypes.STRING,
        allowNull : false,
    },
    start_year : {
        type : DataTypes.DATE,
        allowNull : false,
    },
    end_year : {
        type : DataTypes.DATE,
        allowNull : false
    }
},
{
    sequelize,
    modelName : "education",
    tableName : "education"
});

export default Education;