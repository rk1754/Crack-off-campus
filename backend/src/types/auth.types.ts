export type signUpRequestBody = {
    email : string;
    password : string;
    name : string;
    phone_number : string;
}

export type LoginRequestBody = {
    email : string;
    password : string;
}