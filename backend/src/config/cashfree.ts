import { Cashfree, CFEnvironment } from "cashfree-pg";
import { CASHFREE_CLIENT_ID, CASHFREE_CLIENT_SECRET, CASHFREE_ENV } from "./config";

// Get the appropriate environment enum
// const env: CFEnvironment =
//   CASHFREE_ENV === "production"
//     ? CFEnvironment.PRODUCTION
//     : CFEnvironment.SANDBOX;


const env: CFEnvironment = CFEnvironment.PRODUCTION;

const clientId = CASHFREE_CLIENT_ID;
const clientSecret = CASHFREE_CLIENT_SECRET;

// Validate credentials
if (!clientId || !clientSecret) {
  throw new Error("Cashfree credentials are missing from environment variables.");
}

// Initialize and export Cashfree instance
const cashfree = new Cashfree(env, clientId, clientSecret);

export { cashfree };
