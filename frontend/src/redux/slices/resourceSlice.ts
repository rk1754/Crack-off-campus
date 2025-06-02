// src/redux/slices/resourceSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface ResourceState {
  loading: boolean;
  error: string | null;
}

const initialState: ResourceState = {
  loading: false,
  error: null,
};

// Helper function to download a file from a Blob
const triggerFileDownload = (blob: Blob, fileName: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// Async thunks for downloading files
export const downloadResumeTemplate = createAsyncThunk(
  "resources/downloadResumeTemplate",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/new/resume/download/templates/resume", {
        responseType: "blob", // Important for file downloads
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Adjust based on your auth setup
        },
      });
      triggerFileDownload(response.data, "resume_template.pdf");
      return null; // No need to return data to the store
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to download resume template");
    }
  }
);

export const downloadHrEmailTemplate = createAsyncThunk(
  "resources/downloadHrEmailTemplate",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/new/resume/download/templates/hr-email", {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      triggerFileDownload(response.data, "hr_email_template.pdf");
      return null;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to download HR email template");
    }
  }
);

export const downloadReferralTemplate = createAsyncThunk(
  "resources/downloadReferralTemplate",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/new/resume/download/templates/referral", {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      triggerFileDownload(response.data, "referral_template.pdf");
      return null;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to download referral template");
    }
  }
);

export const downloadColdMailTemplate = createAsyncThunk(
  "resources/downloadColdMailTemplate",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/new/resume/download/templates/cold-mail", {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      triggerFileDownload(response.data, "cold_mail_template.pdf");
      return null;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to download cold mail template");
    }
  }
);

export const downloadCoverLetterTemplate = createAsyncThunk(
  "resources/downloadCoverLetterTemplate",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/new/resume/download/templates/cover-letter", {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      triggerFileDownload(response.data, "cover_letter_template.pdf");
      return null;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to download cover letter template");
    }
  }
);

const resourceSlice = createSlice({
  name: "resources",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(downloadResumeTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(downloadResumeTemplate.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(downloadResumeTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(downloadHrEmailTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(downloadHrEmailTemplate.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(downloadHrEmailTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(downloadReferralTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(downloadReferralTemplate.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(downloadReferralTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(downloadColdMailTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(downloadColdMailTemplate.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(downloadColdMailTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(downloadCoverLetterTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(downloadCoverLetterTemplate.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(downloadCoverLetterTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default resourceSlice.reducer;