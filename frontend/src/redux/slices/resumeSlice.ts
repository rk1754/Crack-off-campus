import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { BACKEND_URL } from "../config";

export interface ResumeTemplate {
  _id: string;
  name: string;
  type: string;
  url: string;
  [key: string]: any;
}

interface ResumeState {
  templates: ResumeTemplate[];
  loading: boolean;
  error: string | null;
  message: string | null;
}

const initialState: ResumeState = {
  templates: [],
  loading: false,
  error: null,
  message: null,
};


export const fetchTemplatesByType = createAsyncThunk<ResumeTemplate[], string>(
  "resume/fetchTemplatesByType",
  async (type, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BACKEND_URL}/resume/type/${type}`);
      return res.data.templates;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch templates");
    }
  }
);

export const fetchAllTemplates = createAsyncThunk<ResumeTemplate[]>(
  "resume/fetchAllTemplates",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BACKEND_URL}/resume/all`);
      return res.data.templates;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch all templates");
    }
  }
);

export const downloadAllTemplates = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>(
  "resume/downloadAllTemplates",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/resume/download-all`, {
        responseType: "blob", // important to get binary data
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "templates.zip"); // filename for download
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to download templates");
    }
  }
);

export const uploadResumeTemplate = createAsyncThunk<
  ResumeTemplate,
  FormData
>(
  "resume/uploadResumeTemplate",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BACKEND_URL}/resume/new`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.template;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to upload template");
    }
  }
);

export const updateResumeTemplate = createAsyncThunk<
  ResumeTemplate,
  { id: string; formData: FormData }
>(
  "resume/updateResumeTemplate",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${BACKEND_URL}/resume/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.template;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to update template");
    }
  }
);

export const deleteResumeTemplate = createAsyncThunk<
  string,
  string
>(
  "resume/deleteResumeTemplate",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${BACKEND_URL}/resume/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete template");
    }
  }
);


const resumeSlice = createSlice({
  name: "resume",
  initialState,
  reducers: {
    clearResumeError(state) {
      state.error = null;
    },
    clearResumeMessage(state) {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchTemplatesByType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTemplatesByType.fulfilled, (state, action: PayloadAction<ResumeTemplate[]>) => {
        state.loading = false;
        state.templates = action.payload;
      })
      .addCase(fetchTemplatesByType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchAllTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTemplates.fulfilled, (state, action: PayloadAction<ResumeTemplate[]>) => {
        state.loading = false;
        state.templates = action.payload;
      })
      .addCase(fetchAllTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(uploadResumeTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadResumeTemplate.fulfilled, (state, action: PayloadAction<ResumeTemplate>) => {
        state.loading = false;
        state.templates.push(action.payload);
        state.message = "Template uploaded successfully";
      })
      .addCase(uploadResumeTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updateResumeTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateResumeTemplate.fulfilled, (state, action: PayloadAction<ResumeTemplate>) => {
        state.loading = false;
        state.templates = state.templates.map(t =>
          t._id === action.payload._id ? action.payload : t
        );
        state.message = "Template updated successfully";
      })
      .addCase(updateResumeTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(deleteResumeTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteResumeTemplate.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.templates = state.templates.filter(t => t._id !== action.payload);
        state.message = "Template deleted successfully";
      })
      .addCase(deleteResumeTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(downloadAllTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(downloadAllTemplates.fulfilled, (state) => {
        state.loading = false;
        state.message = "Download started";
      })
      .addCase(downloadAllTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Download failed";
      });
  },
});

export const { clearResumeError, clearResumeMessage } = resumeSlice.actions;
export default resumeSlice.reducer;