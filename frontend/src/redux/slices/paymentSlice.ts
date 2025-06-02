import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BACKEND_URL } from "../config";

export const createPaymentOrder = createAsyncThunk(
  "/payment/createPaymentOrder",
  async (amount: number, { rejectWithValue }) => {
    try {
      const res = await axios.post(`/payment/create-order`, {
        amount,
      });
      return res.data;
    } catch (err: any) {
      console.error(err);
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const verifyAndStorePayment = createAsyncThunk(
  "/payment/verifyAndStorePayment",
  async (
    payload: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
      amount: number;
      currency: string;
      user_id: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.post("/api/v1/payment/verify", payload);
      return res.data;
    } catch (err: any) {
      console.error(err);
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

interface PaymentState {
  loading: boolean;
  error: string | null;
  order: {
    order_id?: string;
    currency?: string;
    amount?: number;
  } | null;
  payment: any | null;
  success: boolean;
}

const initialState: PaymentState = {
  loading: false,
  error: null,
  order: null,
  payment: null,
  success: false,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    resetPaymentState: (state) => {
      state.loading = false;
      state.error = null;
      state.order = null;
      state.payment = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(createPaymentOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.order = null;
        state.success = false;
      })
      .addCase(createPaymentOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = {
          order_id: action.payload.order_id,
          currency: action.payload.currency,
          amount: action.payload.amount,
        };
        state.error = null;
        state.success = true;
      })
      .addCase(createPaymentOrder.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to create payment order";
        state.order = null;
        state.success = false;
      })

      .addCase(verifyAndStorePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(verifyAndStorePayment.fulfilled, (state, action) => {
        state.loading = false;
        state.payment = action.payload.payment;
        state.error = null;
        state.success = true;
      })
      .addCase(verifyAndStorePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to verify payment";
        state.payment = null;
        state.success = false;
      });
  },
});

export const { resetPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;
