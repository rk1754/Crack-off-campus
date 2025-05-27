// types/cashfree.d.ts
interface Cashfree {
    new (config: { mode: "production" | "sandbox" }): Cashfree;
    checkout(options: {
      paymentSessionId: string;
      returnUrl: string;
      redirectTarget?: "_self" | "_blank";
    }): Promise<{
      error?: { message: string };
      redirect?: boolean;
    }>;
  }
  
  interface Window {
    Cashfree: Cashfree;
  }