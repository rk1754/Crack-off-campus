import { DataTypes, Model, UUIDV4 } from "sequelize";
import sequelize from "../config/db";
import { DATE } from "sequelize";

class User extends Model {
  public id!: string;
  public name?:string;
  public email!: string;
  public password!: string;
  public phone_number!: string;
  public is_employer!: true | false;
  public google_id?: string;
  public profile_pic?: string;
  public bio?: string;
  public cover_image? : string;
  public provider!: "manual" | "google";
  public resetPasswordToken? : string | null;
  public resetPasswordExpires ? : Date | null;
  public subscription_type!: string;
  public subscription_expiry!: Date;
  public is_premium?: boolean;
  public readonly created_at?: Date;
  public readonly updated_at?: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    name : {
        type : DataTypes.STRING,
        allowNull : true,
    },
    google_id: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_employer: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    profile_pic: {
      type: DataTypes.STRING,
      allowNull: true,
    },
      cover_image : {
        type : DataTypes.STRING,
          allowNull : true,
      },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    role : {
      type : DataTypes.ENUM('user', 'admin')
    },
    skills : {
      type : DataTypes.ARRAY(DataTypes.STRING),
      allowNull : true,
    },
    provider: {
      type: DataTypes.ENUM("manual", "google"),
      defaultValue: "manual",
    },
      subscription_type : {
        type : DataTypes.ENUM('basic', 'standard', 'booster', 'regular', 'job', "resume", "other_templates"),
          defaultValue : 'regular'
      },
      subscription_expiry : {
        type : DataTypes.DATE,
          allowNull : true,
      },
      is_premium : {
        type : DataTypes.BOOLEAN,
          defaultValue : false,
      },
      resetPasswordToken : {
        type : DataTypes.STRING,
          allowNull : true,
      },
      resetPasswordExpires : {
        type : DataTypes.DATE,
          allowNull : true,
      },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    timestamps: true,
    modelName: "user",
    tableName: "user",
    indexes: [
      {
        fields: ["email"],
        unique: true,
      },
    ],
  }
);

export default User;
