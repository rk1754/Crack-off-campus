import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import User from "./user.model";

class Education extends Model{
    public id!: string;
    public education!: string;
    public start_year!: Date;
    public end_year!: Date;
    public specialization?: string;
<<<<<<< HEAD
=======
    public college?: string;
>>>>>>> 410557a16c5902b86bb8a61d687c4901d1e4fac8
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
<<<<<<< HEAD
=======
    },
    specialization: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    college: {
        type: DataTypes.STRING,
        allowNull: true,
>>>>>>> 410557a16c5902b86bb8a61d687c4901d1e4fac8
    }
},
{
    sequelize,
    modelName : "education",
    tableName : "education"
});

export default Education;