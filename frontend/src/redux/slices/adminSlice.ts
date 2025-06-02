import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BACKEND_URL } from "../config";
import axios from "axios";

interface Admin {
  id: string;
  name?: string;
  email: string;
  phone_number?: string;
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
  return response.data;
});

export const loginAdmin = createAsyncThunk(
  "admin/loginAdmin",
  async (credentials: { email: string; password: string }) => {
    const response = await axios.post(
      `${BACKEND_URL}/admin/login`,
      credentials
    );
    return response.data;
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
      state.admin = action.payload.admin;
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
