import { Cashfree, CFEnvironment } from "cashfree-pg";

// Get the appropriate environment enum
const env: CFEnvironment =
  process.env.CASHFREE_ENV === "production"
    ? CFEnvironment.PRODUCTION
    : CFEnvironment.SANDBOX;

const clientId = process.env.CASHFREE_APP_ID || "";
const clientSecret = process.env.CASHFREE_SECRET_KEY || "";

// Validate credentials
if (!clientId || !clientSecret) {
  throw new Error("Cashfree credentials are missing from environment variables.");
}

// Initialize and export Cashfree instance
const cashfree = new Cashfree(env, clientId, clientSecret);

export { cashfree };
