// src/slices/userSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BACKEND_URL } from "../config";
import axios from "axios";

// Define the shape of a User object (adjust based on your API response)
interface User {
  id: string;
  name?: string;
  email: string;
  phone_number?: string;
  is_employer?: boolean;
  google_id?: string;
  profile_pic?: string;
  bio?: string;
  cover_image?: string;
  provider?: "manual" | "google";
  subscription_type?: string;
  subscription_expiry?: Date;
  is_premium?: boolean;
  skills?: string[];
}
  

// Define the shape of the user slice state
interface UserState {
  user: User | null;
  users: User[];
  token : string | null;
  loading: boolean;
  error: string | null;
  message: string | null;
}

// Define the initial state with the type
const initialState: UserState = {
  user: null,
  users: [],
  token : null,
  loading: false,
  error: null,
  message: null,
};

// Define types for thunk payloads (adjust based on API responses)
interface AuthResponse {
  user: User;
  token?: string;
  message?: string;
}

interface MessageResponse {
  message: string;
}

// Async thunks
export const fetchCurrentUser = createAsyncThunk<User>(
  "user/fetchCurrent",
  async () => {
    const res = await axios.get(`${BACKEND_URL}/auth/me`);
    return res.data.user;
  }
);

export const loginUser = createAsyncThunk<AuthResponse, { email: string; password: string }>(
  "user/login",
  async (data) => {
    const res = await axios.post(`${BACKEND_URL}/auth/login`, data);
    return res.data;
  }
);

export const registerUser = createAsyncThunk<AuthResponse, { name: string; email: string; password: string; phone_number: string }>(
  "user/register",
  async (data) => {
    const res = await axios.post(`${BACKEND_URL}/auth/register`, data);
    return res.data;
  }
);

export const getAllUsers = createAsyncThunk<User[]>(
  "user/getAll",
  async () => {
    const res = await axios.get(`${BACKEND_URL}/auth/all`);
    return res.data.users;
  }
);

export const forgotPassword = createAsyncThunk<MessageResponse, { email: string }>(
  "user/forgotPassword",
  async (data) => {
    const res = await axios.post(`${BACKEND_URL}/auth/forgot-password`, data);
    return res.data;
  }
);

export const resetPassword = createAsyncThunk<MessageResponse, { token: string; password: string }>(
  "user/resetPassword",
  async (data) => {
    const res = await axios.post(`${BACKEND_URL}/auth/reset-password`, data);
    return res.data;
  }
);

export const setProfile = createAsyncThunk<User, { [key: string]: any }>(
  "user/setProfile",
  async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => formData.append(key, value));
    const res = await axios.put(`${BACKEND_URL}/auth/profile`, formData);
    return res.data;
  }
);

export const setCoverImage = createAsyncThunk<User, { image: File }>(
  "user/setCoverImage",
  async (data) => {
    const formData = new FormData();
    formData.append('image', data.image);
    const res = await axios.put(`${BACKEND_URL}/auth/cover`, formData);
    return res.data;
  }
);

export const addSkills = createAsyncThunk<User, { skills: string[] }>(
  "user/addSkills",
  async (data) => {
    const res = await axios.post(`${BACKEND_URL}/auth/add-skills`, data);
    return res.data;
  }
);

export const fetchUserById = createAsyncThunk<User, string>(
  "user/fetchById",
  async (id) => {
    const res = await axios.get(`${BACKEND_URL}/auth/${id}`);
    return res.data.user;
  }
);

export const updateUser = createAsyncThunk<User, {data: { [key: string]: any}}>(
  "user/update",
  async ({ data }) => {
    console.log("updateUser thunk called", data);
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => formData.append(key, value));
const res = await axios.put(`${BACKEND_URL}/auth/update-me`, formData);
    return res.data;
  }
)
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
    logout: (state) => {
      state.user = null;
    },
    login: (state, action) => {
      state.user = action.payload.user;
    }
  },
  extraReducers: (builder) => {
    const pending = (state: UserState) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    };
    
    builder
      .addCase(updateUser.pending, pending)
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      }
    )
    .addCase(updateUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Something went wrong";
    })

      .addCase(fetchCurrentUser.pending, pending)
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      })

      .addCase(loginUser.pending, pending)
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        if(action.payload.token){
          localStorage.setItem("token", action.payload.token);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      })

      .addCase(registerUser.pending, pending)
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        if(action.payload.token){
          localStorage.setItem("token", action.payload.token);
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      })

      .addCase(getAllUsers.pending, pending)
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      })

      .addCase(forgotPassword.pending, pending)
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || "Password reset email sent";
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      })

      .addCase(resetPassword.pending, pending)
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || "Password has been reset";
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      })

      .addCase(setProfile.pending, pending)
      .addCase(setProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(setProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      })

      .addCase(setCoverImage.pending, pending)
      .addCase(setCoverImage.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(setCoverImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      })

      .addCase(addSkills.pending, pending)
      .addCase(addSkills.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(addSkills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      })

      .addCase(fetchUserById.pending, pending)
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export const { clearError, clearMessage, logout, login } = userSlice.actions;
export default userSlice.reducer;
export type { UserState, User }; // Export types for use in store and components
