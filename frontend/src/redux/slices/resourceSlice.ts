// src/redux/slices/resourceSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BACKEND_URL } from "../config";

interface ResourceState {
  loading: boolean;
  error: string | null;
}

const initialState: ResourceState = {
  loading: false,
  error: null,
};

// Helper function to download a file from backend response
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

// Helper function to make protected download request
const makeProtectedDownloadRequest = async (endpoint: string, fileName: string) => {
  const response = await axios.get(`${BACKEND_URL}/resources${endpoint}`, {
    responseType: 'blob',
    withCredentials: true, // Include authentication cookies
  });
  
  // Create blob from response
  const blob = new Blob([response.data], { type: 'application/pdf' });
  triggerFileDownload(blob, fileName);
  
  return null; // No need to return data to the store
};

// Async thunks for downloading files - now using protected backend endpoints
export const downloadResumeTemplate = createAsyncThunk(
  "resources/downloadResumeTemplate",
  async (_, { rejectWithValue }) => {
    try {
      return await makeProtectedDownloadRequest("/download/resume", "resume_template.pdf");
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || "Failed to download resume template";
      return rejectWithValue(message);
    }
  }
);

export const downloadHrEmailTemplate = createAsyncThunk(
  "resources/downloadHrEmailTemplate",
  async (_, { rejectWithValue }) => {
    try {
      return await makeProtectedDownloadRequest("/download/hr-email", "hr_email_template.pdf");
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || "Failed to download HR email template";
      return rejectWithValue(message);
    }
  }
);

export const downloadReferralTemplate = createAsyncThunk(
  "resources/downloadReferralTemplate",
  async (_, { rejectWithValue }) => {
    try {
      return await makeProtectedDownloadRequest("/download/referral", "referral_template.pdf");
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || "Failed to download referral template";
      return rejectWithValue(message);
    }
  }
);

export const downloadColdMailTemplate = createAsyncThunk(
  "resources/downloadColdMailTemplate",
  async (_, { rejectWithValue }) => {
    try {
      return await makeProtectedDownloadRequest("/download/cold-mail", "cold_mail_template.pdf");
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || "Failed to download cold mail template";
      return rejectWithValue(message);
    }
  }
);

export const downloadCoverLetterTemplate = createAsyncThunk(
  "resources/downloadCoverLetterTemplate",
  async (_, { rejectWithValue }) => {
    try {
      return await makeProtectedDownloadRequest("/download/cover-letter", "cover_letter_template.pdf");
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || "Failed to download cover letter template";
      return rejectWithValue(message);
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