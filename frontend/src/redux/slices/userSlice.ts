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
<<<<<<< HEAD
  subscription_type_2?:string;
=======
  subscription_type_2?: string;
>>>>>>> 410557a16c5902b86bb8a61d687c4901d1e4fac8
  subscription_expiry?: Date;
  is_premium?: boolean;
  skills?: string[];
}
<<<<<<< HEAD
  
=======
>>>>>>> 410557a16c5902b86bb8a61d687c4901d1e4fac8

// Define the shape of the user slice state
interface UserState {
  user: User | null;
  users: User[];
<<<<<<< HEAD
  token : string | null;
=======
  token: string | null;
>>>>>>> 410557a16c5902b86bb8a61d687c4901d1e4fac8
  loading: boolean;
  error: string | null;
  message: string | null;
}

// Define the initial state with the type
const initialState: UserState = {
  user: null,
  users: [],
<<<<<<< HEAD
  token : null,
=======
  token: null,
>>>>>>> 410557a16c5902b86bb8a61d687c4901d1e4fac8
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

<<<<<<< HEAD
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
=======
export const loginUser = createAsyncThunk<
  AuthResponse,
  { email: string; password: string }
>("user/login", async (data) => {
  const res = await axios.post(`${BACKEND_URL}/auth/login`, data);
  return res.data;
});

export const registerUser = createAsyncThunk<
  AuthResponse,
  { name: string; email: string; password: string; phone_number: string }
>("user/register", async (data) => {
  const res = await axios.post(`${BACKEND_URL}/auth/register`, data);
  return res.data;
});

export const getAllUsers = createAsyncThunk<User[]>("user/getAll", async () => {
  const res = await axios.get(`${BACKEND_URL}/auth/all`);
  return res.data.users;
});

export const forgotPassword = createAsyncThunk<
  MessageResponse,
  { email: string }
>("user/forgotPassword", async (data) => {
  const res = await axios.post(`${BACKEND_URL}/auth/forgot-password`, data);
  return res.data;
});

export const resetPassword = createAsyncThunk<
  MessageResponse,
  { token: string; password: string }
>("user/resetPassword", async (data) => {
  const res = await axios.post(`${BACKEND_URL}/auth/reset-password`, data);
  return res.data;
});
>>>>>>> 410557a16c5902b86bb8a61d687c4901d1e4fac8

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
<<<<<<< HEAD
    formData.append('image', data.image);
=======
    formData.append("image", data.image);
>>>>>>> 410557a16c5902b86bb8a61d687c4901d1e4fac8
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

<<<<<<< HEAD
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
=======
export const updateUser = createAsyncThunk<
  User,
  { data: { [key: string]: any } }
>("user/update", async ({ data }) => {
  console.log("updateUser thunk called", data);
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (
      (key === "profile_pic" || key === "cover_image") &&
      (!value || typeof value !== "object") // Only append if value is a File
    ) {
      return;
    }
    // Stringify skills array for backend compatibility
    if (key === "skills" && Array.isArray(value)) {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value);
    }
  });
  const res = await axios.put(`${BACKEND_URL}/auth/update-me`, formData);
  return res.data;
});

// Admin: Delete user by ID
export const deleteUserById = createAsyncThunk<
  string, // returns deleted user ID
  string // user ID
>("user/deleteUserById", async (userId, { rejectWithValue }) => {
  try {
    await axios.delete(`${BACKEND_URL}/admin/user/${userId}`, {
      withCredentials: true,
    });
    return userId;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to delete user"
    );
  }
});

>>>>>>> 410557a16c5902b86bb8a61d687c4901d1e4fac8
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
<<<<<<< HEAD
    }
=======
    },
>>>>>>> 410557a16c5902b86bb8a61d687c4901d1e4fac8
  },
  extraReducers: (builder) => {
    const pending = (state: UserState) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    };
<<<<<<< HEAD
    
=======

>>>>>>> 410557a16c5902b86bb8a61d687c4901d1e4fac8
    builder
      .addCase(updateUser.pending, pending)
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
<<<<<<< HEAD
      }
    )
    .addCase(updateUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Something went wrong";
    })
=======
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      })
>>>>>>> 410557a16c5902b86bb8a61d687c4901d1e4fac8

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
<<<<<<< HEAD
        if(action.payload.token){
=======
        if (action.payload.token) {
>>>>>>> 410557a16c5902b86bb8a61d687c4901d1e4fac8
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
<<<<<<< HEAD
        if(action.payload.token){
=======
        if (action.payload.token) {
>>>>>>> 410557a16c5902b86bb8a61d687c4901d1e4fac8
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
<<<<<<< HEAD
=======
      })

      .addCase(deleteUserById.pending, pending)
      .addCase(deleteUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((u) => u.id !== action.payload);
        state.message = "User deleted successfully";
      })
      .addCase(deleteUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to delete user";
>>>>>>> 410557a16c5902b86bb8a61d687c4901d1e4fac8
      });
  },
});

export const { clearError, clearMessage, logout, login } = userSlice.actions;
<<<<<<< HEAD
export default userSlice.reducer;
export type { UserState, User }; // Export types for use in store and components
=======

export default userSlice.reducer;
>>>>>>> 410557a16c5902b86bb8a61d687c4901d1e4fac8
