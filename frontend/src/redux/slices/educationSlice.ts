import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BACKEND_URL } from "../config";
import axios from "axios";

<<<<<<< HEAD
export const addEducation = createAsyncThunk(
  '/education/add',
  async (data) => {
    const res = await axios.post(`${BACKEND_URL}/education/add`, data);
    return res.data.education;
  }
);

export const getMyEducation = createAsyncThunk(
  '/education/my/education',
=======
export const addEducation = createAsyncThunk("/education/add", async (data) => {
  const res = await axios.post(`${BACKEND_URL}/education/add`, data);
  return res.data.education;
});

export const getMyEducation = createAsyncThunk(
  "/education/my/education",
>>>>>>> 410557a16c5902b86bb8a61d687c4901d1e4fac8
  async () => {
    const res = await axios.get(`${BACKEND_URL}/education/my/education`);
    return res.data;
  }
);

export const updateMyEducation = createAsyncThunk(
<<<<<<< HEAD
  '/education/update',
  async (data) => {
    const res = await axios.put(`${BACKEND_URL}/education/update`, data);
    return res.data;
=======
  "/education/update",
  async (data: any) => {
    const id = data.id || data._id;
    if (!id) throw new Error("Education ID is required");
    // Remove id/_id from body
    const { id: _id, _id: __id, ...body } = data;
    const res = await axios.put(`${BACKEND_URL}/education/update/${id}`, body);
    return res.data.userEducation || res.data;
  }
);

export const deleteEducation = createAsyncThunk(
  "/education/remove",
  async (id: string) => {
    await axios.delete(`${BACKEND_URL}/education/remove/${id}`);
    return id;
>>>>>>> 410557a16c5902b86bb8a61d687c4901d1e4fac8
  }
);

export const deleteMyEducation = createAsyncThunk(
<<<<<<< HEAD
  '/education/remove',
=======
  "/education/remove/my",
>>>>>>> 410557a16c5902b86bb8a61d687c4901d1e4fac8
  async () => {
    const res = await axios.delete(`${BACKEND_URL}/education/remove`);
    return res.data;
  }
);

export const getEducationById = createAsyncThunk(
<<<<<<< HEAD
  '/education/:id',
=======
  "/education/:id",
>>>>>>> 410557a16c5902b86bb8a61d687c4901d1e4fac8
  async (id) => {
    const res = await axios.get(`${BACKEND_URL}/${id}`);
    return res.data;
  }
);

<<<<<<< HEAD

const educationSlice = createSlice({
  name: "education",
  initialState: {
    education: null,       
    educationList: [],     
=======
const educationSlice = createSlice({
  name: "education",
  initialState: {
    education: null,
    educationList: [],
>>>>>>> 410557a16c5902b86bb8a61d687c4901d1e4fac8
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

<<<<<<< HEAD
      
=======
>>>>>>> 410557a16c5902b86bb8a61d687c4901d1e4fac8
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

<<<<<<< HEAD
      
=======
>>>>>>> 410557a16c5902b86bb8a61d687c4901d1e4fac8
      .addCase(getMyEducation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyEducation.fulfilled, (state, action) => {
        state.loading = false;
        state.educationList = action.payload.userEducation || [];
      })
      .addCase(getMyEducation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

<<<<<<< HEAD
      
=======
>>>>>>> 410557a16c5902b86bb8a61d687c4901d1e4fac8
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

<<<<<<< HEAD
      
=======
      .addCase(deleteEducation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEducation.fulfilled, (state, action) => {
        state.loading = false;
        state.education = null;
      })
      .addCase(deleteEducation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

>>>>>>> 410557a16c5902b86bb8a61d687c4901d1e4fac8
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

<<<<<<< HEAD
      
=======
>>>>>>> 410557a16c5902b86bb8a61d687c4901d1e4fac8
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
<<<<<<< HEAD
  }
=======
  },
>>>>>>> 410557a16c5902b86bb8a61d687c4901d1e4fac8
});

export default educationSlice.reducer;
