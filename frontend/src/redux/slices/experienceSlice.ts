import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BACKEND_URL } from "../config";

export const addExperience = createAsyncThunk(
<<<<<<< HEAD
  '/experience/create',
  async (data) => {
    const res = await axios.post(`${BACKEND_URL}/experience/create`, data);
   return res.data.experience;
=======
  "/experience/create",
  async (data) => {
    const res = await axios.post(`${BACKEND_URL}/experience/create`, data);
    return res.data.experience;
>>>>>>> 410557a16c5902b86bb8a61d687c4901d1e4fac8
  }
);

export const getMyExperience = createAsyncThunk(
<<<<<<< HEAD
  '/experience/my/experience',
=======
  "/experience/my/experience",
>>>>>>> 410557a16c5902b86bb8a61d687c4901d1e4fac8
  async () => {
    const res = await axios.get(`${BACKEND_URL}/experience/my/experience`);
    return res.data;
  }
);

export const updateExperience = createAsyncThunk(
<<<<<<< HEAD
  '/experience/update',
  async (data) => {
    const res = await axios.put(`${BACKEND_URL}/experience/update`, data);
    return res.data;
=======
  "/experience/update",
  async (data: any) => {
    const id = data.id || data._id;
    if (!id) throw new Error("Experience ID is required");
    // Remove id/_id from body
    const { id: _id, _id: __id, ...body } = data;
    const res = await axios.put(`${BACKEND_URL}/experience/update/${id}`, body);
    return res.data.experience || res.data;
>>>>>>> 410557a16c5902b86bb8a61d687c4901d1e4fac8
  }
);

export const getExperienceById = createAsyncThunk(
<<<<<<< HEAD
  '/experience/get/:id',
=======
  "/experience/get/:id",
>>>>>>> 410557a16c5902b86bb8a61d687c4901d1e4fac8
  async (id) => {
    const res = await axios.get(`${BACKEND_URL}/experience/${id}`);
    return res.data;
  }
);

export const deleteExperience = createAsyncThunk(
<<<<<<< HEAD
  '/experience/delete/:id',
=======
  "/experience/delete/:id",
>>>>>>> 410557a16c5902b86bb8a61d687c4901d1e4fac8
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
<<<<<<< HEAD
      })

      builder.addCase(getMyExperience.pending, (state) => {
=======
      });

    builder
      .addCase(getMyExperience.pending, (state) => {
>>>>>>> 410557a16c5902b86bb8a61d687c4901d1e4fac8
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyExperience.fulfilled, (state, action) => {
        state.loading = false;
        state.experiences = action.payload.experience || [];
      })
      .addCase(getMyExperience.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
<<<<<<< HEAD
      })

      builder.addCase(updateExperience.pending, (state) => {
=======
      });

    builder
      .addCase(updateExperience.pending, (state) => {
>>>>>>> 410557a16c5902b86bb8a61d687c4901d1e4fac8
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExperience.fulfilled, (state, action) => {
        state.loading = false;
<<<<<<< HEAD
        const index = state.experiences.findIndex(exp => exp._id === action.payload._id);
=======
        const index = state.experiences.findIndex(
          (exp) => exp._id === action.payload._id
        );
>>>>>>> 410557a16c5902b86bb8a61d687c4901d1e4fac8
        if (index !== -1) {
          state.experiences[index] = action.payload;
        }
      })
      .addCase(updateExperience.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
<<<<<<< HEAD
      })

      builder.addCase(getExperienceById.pending, (state) => {
=======
      });

    builder
      .addCase(getExperienceById.pending, (state) => {
>>>>>>> 410557a16c5902b86bb8a61d687c4901d1e4fac8
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
<<<<<<< HEAD
      })

      builder.addCase(deleteExperience.pending, (state) => {
=======
      });

    builder
      .addCase(deleteExperience.pending, (state) => {
>>>>>>> 410557a16c5902b86bb8a61d687c4901d1e4fac8
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
<<<<<<< HEAD
  }
});

export default experienceSlice.reducer;
=======
  },
});

export default experienceSlice.reducer;
>>>>>>> 410557a16c5902b86bb8a61d687c4901d1e4fac8
