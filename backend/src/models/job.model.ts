import { DataTypes, Model, UUIDV4 } from "sequelize";
import sequelize from "../config/db";
import Admin from "./admin.model";

class Jobs extends Model{
    public id!: string;
    public title! : string;
    public company_name!: string;
    public description?: string;
    public location?: string;
    public ctc_stipend?: string;
    public experience?: "fresher" | "experienced";
    public admin_id!: string;
    public passout_year?: string;
    public job_url!: string;
    public employment_type?: string;
    public remote ?: boolean;
    public requirements ? : string[];
    public benefits ?: string[];
    public status !: 'open' | 'closed';
    public search_vector ? : any;
    public subscription_type! : string;
    public readonly posted_at !: Date;
    public readonly updated_at !: Date;
    public skills?: string[];
}


Jobs.init({
    id : {
        type : DataTypes.UUID,
        primaryKey : true,
        defaultValue : UUIDV4
    },
    title : {
        type : DataTypes.STRING,
        allowNull : false,
    },
    description : {
        type : DataTypes.TEXT,
        allowNull : false
    },
    location : {
        type : DataTypes.STRING,
    },
    company_name : {
        type : DataTypes.STRING,
        allowNull : false,
    },
    ctc_stipend : {
        type: DataTypes.STRING,
        allowNull: true,
    },
    experience : {
        type : DataTypes.ENUM("fresher", "experienced"),
        allowNull : true,
    },
    job_url: {
        type : DataTypes.STRING,
        allowNull : false
    },
    employment_type : {
        type : DataTypes.STRING,
        allowNull : true,
    },
    passout_year : {
        type : DataTypes.STRING,
        allowNull : true,
    },
    admin_id : {
        type : DataTypes.UUID,
        references: {
            model : Admin,
            key : "id"
        }
    },
    remote : {
        type : DataTypes.BOOLEAN,
        allowNull : true,
    },
    subscription_type : {
        // Add all possible subscription types for jobs
        type : DataTypes.ENUM('gold', 'gold_plus', 'diamond', 'regular', 'job'),
        defaultValue : 'regular'
    },
    requirements : {
        type : DataTypes.ARRAY(DataTypes.STRING),
        allowNull : true,
    },
    benefits : {
        type : DataTypes.ARRAY(DataTypes.STRING),
        allowNull : true,
    },
    status : {
        type : DataTypes.ENUM('open', 'closed'),
        defaultValue : 'open'
    },
    search_vector : {
        type : DataTypes.TSVECTOR,
        allowNull : true,
    },
    skills : {
        type : DataTypes.ARRAY(DataTypes.STRING),
        allowNull : true,
    },
},
{
    sequelize,
    modelName : "jobs",
    tableName : "jobs",
    timestamps : true,
    createdAt : 'posted_at',
    updatedAt : 'updated_at',
    indexes : [
        {
            fields : ['title'],
        },
        {
            fields : ['location'],
        },
        {
            fields : ['search_vector'],
            using : "GIN",
        }
    ]
});

export default Jobs;