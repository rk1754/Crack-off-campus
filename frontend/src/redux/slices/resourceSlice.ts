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
      // Direct download from public folder
      const templateUrl = "/templates/resume_template.pdf";
      
      // Create a link element and trigger download
      const link = document.createElement("a");
      link.href = templateUrl;
      link.download = "resume_template.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return null; // No need to return data to the store
    } catch (error: any) {
      return rejectWithValue("Failed to download resume template");
    }
  }
);

export const downloadHrEmailTemplate = createAsyncThunk(
  "resources/downloadHrEmailTemplate",
  async (_, { rejectWithValue }) => {
    try {
      // Direct download from public folder
      const templateUrl = "/templates/hr_email_template.pdf";
      
      // Create a link element and trigger download
      const link = document.createElement("a");
      link.href = templateUrl;
      link.download = "hr_email_template.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return null;
    } catch (error: any) {
      return rejectWithValue("Failed to download HR email template");
    }
  }
);

export const downloadReferralTemplate = createAsyncThunk(
  "resources/downloadReferralTemplate",
  async (_, { rejectWithValue }) => {
    try {
      // Direct download from public folder
      const templateUrl = "/templates/referral_template.pdf";
      
      // Create a link element and trigger download
      const link = document.createElement("a");
      link.href = templateUrl;
      link.download = "referral_template.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return null;
    } catch (error: any) {
      return rejectWithValue("Failed to download referral template");
    }
  }
);

export const downloadColdMailTemplate = createAsyncThunk(
  "resources/downloadColdMailTemplate",
  async (_, { rejectWithValue }) => {
    try {
      // Direct download from public folder
      const templateUrl = "/templates/cold_mail_template.pdf";
      
      // Create a link element and trigger download
      const link = document.createElement("a");
      link.href = templateUrl;
      link.download = "cold_mail_template.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return null;
    } catch (error: any) {
      return rejectWithValue("Failed to download cold mail template");
    }
  }
);

export const downloadCoverLetterTemplate = createAsyncThunk(
  "resources/downloadCoverLetterTemplate",
  async (_, { rejectWithValue }) => {
    try {
      // Direct download from public folder
      const templateUrl = "/templates/cover_letter_template.pdf";
      
      // Create a link element and trigger download
      const link = document.createElement("a");
      link.href = templateUrl;
      link.download = "cover_letter_template.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return null;
    } catch (error: any) {
      return rejectWithValue("Failed to download cover letter template");
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