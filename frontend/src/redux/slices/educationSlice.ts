import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BACKEND_URL } from "../config";
import axios from "axios";

export const addEducation = createAsyncThunk(
  '/education/add',
  async (data) => {
    const res = await axios.post(`${BACKEND_URL}/education/add`, data);
    return res.data;
  }
);

export const getMyEducation = createAsyncThunk(
  '/education/my/education',
  async () => {
    const res = await axios.get(`${BACKEND_URL}/education/my/education`);
    return res.data;
  }
);

export const updateMyEducation = createAsyncThunk(
  '/education/update',
  async (data) => {
    const res = await axios.put(`${BACKEND_URL}/education/update`, data);
    return res.data;
  }
);

export const deleteMyEducation = createAsyncThunk(
  '/education/remove',
  async () => {
    const res = await axios.delete(`${BACKEND_URL}/education/remove`);
    return res.data;
  }
);

export const getEducationById = createAsyncThunk(
  '/education/:id',
  async (id) => {
    const res = await axios.get(`${BACKEND_URL}/${id}`);
    return res.data;
  }
);


const educationSlice = createSlice({
  name: "education",
  initialState: {
    education: null,       
    educationList: [],     
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      
      .addCase(addEducation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addEducation.fulfilled, (state, action) => {
        state.loading = false;
        state.education = action.payload;
      })
      .addCase(addEducation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      
      .addCase(getMyEducation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyEducation.fulfilled, (state, action) => {
        state.loading = false;
        state.education = action.payload;
      })
      .addCase(getMyEducation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      
      .addCase(updateMyEducation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMyEducation.fulfilled, (state, action) => {
        state.loading = false;
        state.education = action.payload;
      })
      .addCase(updateMyEducation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      
      .addCase(deleteMyEducation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMyEducation.fulfilled, (state) => {
        state.loading = false;
        state.education = null;
      })
      .addCase(deleteMyEducation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      
      .addCase(getEducationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEducationById.fulfilled, (state, action) => {
        state.loading = false;
        state.education = action.payload;
      })
      .addCase(getEducationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default educationSlice.reducer;
