// src/slices/jobSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BACKEND_URL } from "../config";
import axios from "axios";

export interface Job {
  id: string;
  title: string;
  description: string;
  location?: string;
  ctc_stipend?: string; // ADDED
  company_name: string;
  job_url: string;
  employment_type?: string;
  remote?: boolean;
  requirements?: string[];
  benefits?: string[];
  status: "open" | "closed";
  subscription_type: string;
  posted_at: string | Date; // Keep as is, backend sends string, can be Date object
  updated_at?: string | Date;
  admin_id?: string;
  passout_year?: string; // ADDED
  experience?: "fresher" | "experienced"; // ADDED
  skills?: string[];
  search_vector?: any;
}

interface JobState {
  job: Job | null;
  jobs: Job[];
  loading: boolean;
  error: string | null;
  message: string | null;
}

const initialState: JobState = {
  job: null,
  jobs: [],
  loading: false,
  error: null,
  message: null,
};

interface AllJobsResponse {
  jobs: Job[];
  success: boolean;
}

interface JobResponse {
  job: Job;
  token?: string;
  message?: string;
  success?: boolean;
}

interface MessageResponse {
  success?: boolean;
  message?: string;
}

// Async thunks
export const fetchAllJobs = createAsyncThunk<AllJobsResponse>(
  "job/all",
  async () => {
    const res = await axios.get(`${BACKEND_URL}/job/all`);
    return res.data as AllJobsResponse;
  }
);

export const createNewJob = createAsyncThunk<
  JobResponse,
  { [key: string]: any }
>("job/new", async (data) => {
  const res = await axios.post(`${BACKEND_URL}/job/new`, data);
  return res.data as JobResponse;
});

export const updateJob = createAsyncThunk<
  MessageResponse,
  { id: string; data: { [key: string]: any } }
>("job/update", async ({ id, data }) => {
  const res = await axios.put(`${BACKEND_URL}/job/update/${id}`, data);
  return res.data as MessageResponse;
});

export const deleteJob = createAsyncThunk<MessageResponse, string>(
  "job/delete",
  async (id) => {
    const res = await axios.delete(`${BACKEND_URL}/job/${id}`);
    return res.data as MessageResponse;
  }
);

export const getAllJobsAdmin = createAsyncThunk<AllJobsResponse>(
  "job/all/admin",
  async () => {
    const res = await axios.get(`${BACKEND_URL}/job/all/admin`);
    return res.data as AllJobsResponse;
  }
);
export const getJobById = createAsyncThunk<JobResponse, string>(
  "job/byId",
  async (id) => {
    const res = await axios.get(`${BACKEND_URL}/job/by/id/${id}`);
    return res.data as JobResponse;
  }
);

const handleApplyNow = (applicationUrl: string) => {
  if (applicationUrl) {
    window.open(applicationUrl, "_blank");
  }
};

const jobSlice = createSlice({
  name: "job",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    const pending = (state: JobState) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    };

    const rejected = (state: JobState, action: any) => {
      state.loading = false;
      state.error = action.error.message || "Something went wrong";
    };

    builder
      // fetchAllJobs
      .addCase(fetchAllJobs.pending, pending)
      .addCase(fetchAllJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.jobs;
        state.message = action.payload.success
          ? "Jobs fetched successfully"
          : null;
      })
      .addCase(fetchAllJobs.rejected, rejected)

      // createNewJob
      .addCase(createNewJob.pending, pending)
      .addCase(createNewJob.fulfilled, (state, action) => {
        state.loading = false;
        state.job = action.payload.job;
        state.jobs = [...state.jobs, action.payload.job]; // Add new job to list
        state.message = action.payload.message || "Job created successfully";
      })
      .addCase(createNewJob.rejected, rejected)

      // updateJob
      .addCase(updateJob.pending, pending)
      .addCase(updateJob.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || "Job updated successfully";
        // Optionally update the job in state.jobs if the updated job is returned
        // state.jobs = state.jobs.map((job) =>
        //   job.id === action.meta.arg.id ? { ...job, ...action.payload.job } : job
        // );
      })
      .addCase(updateJob.rejected, rejected)

      // deleteJob
      .addCase(deleteJob.pending, pending)
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || "Job deleted successfully";
        state.jobs = state.jobs.filter((job) => job.id !== action.meta.arg); // Remove deleted job
        if (state.job?.id === action.meta.arg) {
          state.job = null; // Clear current job if deleted
        }
      })
      .addCase(deleteJob.rejected, rejected)

      // getJobById
      .addCase(getJobById.pending, pending)
      .addCase(getJobById.fulfilled, (state, action) => {
        state.loading = false;
        state.job = action.payload.job;
        state.message = action.payload.message || "Job fetched successfully";
        // Optionally update jobs list if the job is already in it
        state.jobs = state.jobs.some((job) => job.id === action.payload.job.id)
          ? state.jobs.map((job) =>
              job.id === action.payload.job.id ? action.payload.job : job
            )
          : [...state.jobs, action.payload.job];
      })
      .addCase(getJobById.rejected, rejected)

      .addCase(getAllJobsAdmin.pending, pending)
      .addCase(getAllJobsAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.jobs;
        state.message = action.payload.success
          ? "Admin jobs fetched successfully"
          : null;
        state.error = null; // Clear any previous errors
      })
      .addCase(getAllJobsAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch admin jobs";
        state.message = null; // Clear any previous messages
      });
  },
});

export const { clearError, clearMessage } = jobSlice.actions;
export default jobSlice.reducer;
export type { JobState, AllJobsResponse, JobResponse, MessageResponse };
