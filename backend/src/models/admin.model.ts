import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";

class Admin extends Model {
  public id!: string;
  public email!: string;
  public password!: string;
  public profile_url?: string;
  public name?: string;
  public phone_number?: string;
  public resetPasswordToken?: string | null;
  public resetPasswordExpires?: Date | null;
  public readonly created_at?: Date;
  public readonly updated_at?: Date;
  public google_id?: string;
}

Admin.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
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
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    modelName: "admin",
    tableName: "admin",
  }
);

export default Admin;
