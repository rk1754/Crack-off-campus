import { Optional } from "sequelize";

export interface PaymentTransactionAttributes {
    id : string;
    user_id : string;
    razorpay_payment_id : string;
    razorpay_order_id : string;
    razorpay_signature : string;
    amount : number;
    currency : string;
    status : string;
    method : string;
    captured : boolean;
    created_at ? : Date;
    updated_at ? : Date;
}

export type PaymentRequestBody = {
    razorpay_order_id : string;
    razorpay_payment_id: string;
    razorpay_signature:string;
    amount : number;
    currency : string;
    user_id : string;
}

export interface SubscriptionMap {
    [key: number]: string;
}

export type PaymentTransactionCreationAttributes = Optional<PaymentTransactionAttributes, 'id' | 'status' | 'method' | 'captured'>;

