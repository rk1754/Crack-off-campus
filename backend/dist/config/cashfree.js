"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cashfree = void 0;
const cashfree_pg_1 = require("cashfree-pg");
const config_1 = require("./config");
// Get the appropriate environment enum
// const env: CFEnvironment =
//   CASHFREE_ENV === "production"
//     ? CFEnvironment.PRODUCTION
//     : CFEnvironment.SANDBOX;
const env = cashfree_pg_1.CFEnvironment.PRODUCTION;
const clientId = config_1.CASHFREE_CLIENT_ID;
const clientSecret = config_1.CASHFREE_CLIENT_SECRET;
// Validate credentials
if (!clientId || !clientSecret) {
    throw new Error("Cashfree credentials are missing from environment variables.");
}
// Initialize and export Cashfree instance
const cashfree = new cashfree_pg_1.Cashfree(env, clientId, clientSecret);
exports.cashfree = cashfree;
