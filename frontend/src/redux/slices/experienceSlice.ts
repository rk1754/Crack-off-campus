import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BACKEND_URL } from "../config";

export const addExperience = createAsyncThunk(
  '/experience/create',
  async (data) => {
    const res = await axios.post(`${BACKEND_URL}/experience/create`, data);
    return res.data;
  }
);

export const getMyExperience = createAsyncThunk(
  '/experience/my/experience',
  async () => {
    const res = await axios.get(`${BACKEND_URL}/experience/my/experience`);
    return res.data;
  }
);

export const updateExperience = createAsyncThunk(
  '/experience/update',
  async (data) => {
    const res = await axios.put(`${BACKEND_URL}/experience/update`, data);
    return res.data;
  }
);

export const getExperienceById = createAsyncThunk(
  '/experience/get/:id',
  async (id) => {
    const res = await axios.get(`${BACKEND_URL}/experience/${id}`);
    return res.data;
  }
);

export const deleteExperience = createAsyncThunk(
  '/experience/delete/:id',
  async (id) => {
    await axios.delete(`${BACKEND_URL}/experience/${id}`);
    return id; // Return the id to use it in the reducer
  }
);

const experienceSlice = createSlice({
  name: "experience",
  initialState: {
    experiences: [],
    currentExperience: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addExperience.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addExperience.fulfilled, (state, action) => {
        state.loading = false;
        state.experiences.push(action.payload);
      })
      .addCase(addExperience.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      builder.addCase(getMyExperience.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyExperience.fulfilled, (state, action) => {
        state.loading = false;
        state.experiences = action.payload;
      })
      .addCase(getMyExperience.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      builder.addCase(updateExperience.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExperience.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.experiences.findIndex(exp => exp._id === action.payload._id);
        if (index !== -1) {
          state.experiences[index] = action.payload;
        }
      })
      .addCase(updateExperience.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      builder.addCase(getExperienceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getExperienceById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentExperience = action.payload;
      })
      .addCase(getExperienceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      builder.addCase(deleteExperience.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExperience.fulfilled, (state, action) => {
        state.loading = false;
        state.experiences = state.experiences.filter(
          (exp) => exp._id !== action.payload // Use action.payload instead of action.meta.arg
        );
      })
      .addCase(deleteExperience.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default experienceSlice.reducer;