import sequelize from "../config/db";
import {DataTypes, Model} from "sequelize";
import {PaymentTransactionAttributes, PaymentTransactionCreationAttributes} from "../types/payment.types";
import User from "./user.model";

class Transactions extends Model<PaymentTransactionAttributes, PaymentTransactionCreationAttributes> implements PaymentTransactionAttributes{
    public id! : string;
    public user_id! : string;
    public razorpay_payment_id!: string;
    public razorpay_order_id! : string;
    public razorpay_signature!: string;
    public amount !:  number;
    public currency !: string;
    public status!: string;
    public method !: string;
    public captured! : boolean;

    public readonly created_at?:Date;
    public readonly updated_at?:Date;
}

Transactions.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.UUID,
            references: {
                model: User,
                key: "id",
            },
        },
        status : {
            type : DataTypes.STRING,
            allowNull : true,
        },
        method: {
            type : DataTypes.STRING,
            allowNull : true,
        },
        captured: {
            type : DataTypes.BOOLEAN,
            defaultValue : false,
        },
        razorpay_payment_id: {
            type : DataTypes.STRING,
            allowNull : false,
        },
        razorpay_order_id: {
            type : DataTypes.STRING,
            allowNull : false,
        },
        razorpay_signature: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        amount: {
            type : DataTypes.DECIMAL,
            allowNull : false,
        },
        currency: {
            type : DataTypes.ENUM('USD', 'INR', 'GBP', 'BTC'),
            defaultValue : "INR"
        }
    },
    {
        sequelize,
        modelName : "transactions",
        tableName : "transactions",
        timestamps : true,
        createdAt : 'created_at',
        updatedAt : 'updated_at'
    });

export default Transactions;