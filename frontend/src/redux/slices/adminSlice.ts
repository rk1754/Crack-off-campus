import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BACKEND_URL } from "../config";
import axios from "axios";

interface Admin {
  id: string;
  name?: string;
  email: string;
  phone_number?: string;
  is_admin: boolean; // <-- Add this property
}

interface AdminState {
  admin: Admin | null;
  loading: boolean;
  error: any;
}

const initialState: AdminState = {
  admin: null,
  loading: false,
  error: null,
};

export const fetchAdmin = createAsyncThunk("admin/fetchAdmin", async () => {
  const response = await axios.get(`${BACKEND_URL}/admin/me`);
  // Ensure is_admin is present and true
  const admin =
    response.data && typeof response.data === "object"
      ? { ...response.data, is_admin: true }
      : null;
  return admin;
});

export const loginAdmin = createAsyncThunk(
  "admin/loginAdmin",
  async (credentials: { email: string; password: string }) => {
    const response = await axios.post(
      `${BACKEND_URL}/admin/login`,
      credentials
    );
    // Ensure is_admin is present and true
    const admin =
      response.data && response.data.admin
        ? { ...response.data.admin, is_admin: true }
        : null;
    return admin;
  }
);

export const logoutAdmin = createAsyncThunk("admin/logoutAdmin", async () => {
  const response = await axios.post(`${BACKEND_URL}/admin/logout`);
  return response.data;
});

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    login: (state, action) => {
      // Always set is_admin: true for admin login
      state.admin = { ...action.payload.admin, is_admin: true };
    },
    logout: (state) => {
      state.admin = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdmin.fulfilled, (state, action) => {
        state.admin = action.payload;
        state.loading = false;
      })
      .addCase(fetchAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.admin = action.payload;
        state.loading = false;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(logoutAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.admin = null;
        state.loading = false;
      })
      .addCase(logoutAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
  },
});

export const { login, logout } = adminSlice.actions;
export default adminSlice.reducer;
