
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BACKEND_URL } from "../config";
import axios from "axios";

export interface DashboardData {
  totalUsers: number;
  totalJobs: number;
  totalApplications: number;
  recentJobs: Array<{
    id: string;
    title: string;
    company: string;
    posted_at: string;
    applications: number;
  }>;
  recentUsers: Array<{
    id: string;
    name: string;
    email: string;
    joined_at: string;
  }>;
  jobsByCategory: Record<string, number>;
  applicationsByDate: Array<{
    date: string;
    count: number;
  }>;
}

export interface AnalyticsState {
  dashboardData: DashboardData | null;
  loading: boolean;
  error: string | null;
}

const initialState: AnalyticsState = {
  dashboardData: null,
  loading: false,
  error: null,
};

// Create an async thunk to fetch dashboard data
export const fetchDashboardData = createAsyncThunk<AnalyticsState>(
  "analytics/fetchDashboardData",
  async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/analytics/`);
      return response.data;
    } catch (error) {
      // Mock data for development
      return {
        totalUsers: 256,
        totalJobs: 120,
        totalApplications: 890,
        recentJobs: [
          {
            id: "1",
            title: "Frontend Developer",
            company: "Tech Solutions Inc",
            posted_at: new Date().toISOString(),
            applications: 25,
          },
          {
            id: "2",
            title: "Backend Engineer",
            company: "Digital Innovations",
            posted_at: new Date().toISOString(),
            applications: 18,
          },
        ],
        recentUsers: [
          {
            id: "1",
            name: "John Doe",
            email: "john.doe@example.com",
            joined_at: new Date().toISOString(),
          },
          {
            id: "2",
            name: "Jane Smith",
            email: "jane.smith@example.com",
            joined_at: new Date().toISOString(),
          },
        ],
        jobsByCategory: {
          "IT & Software": 45,
          "Data Science": 25,
          "Engineering": 30,
          "Marketing": 15,
          "Customer Support": 5,
        },
        applicationsByDate: Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          return {
            date: date.toISOString().split("T")[0],
            count: Math.floor(Math.random() * 50) + 10,
          };
        }).reverse(),
      };
    }
  }
);

const analyticsSlice = createSlice({
  name: "analytics",
  initialState : {
    data : null,
    loading : false,
    error : null,
  },
  reducers: {
    clearAnalyticsErrors(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch dashboard data";
      });
  },
});

export const { clearAnalyticsErrors } = analyticsSlice.actions;
export default analyticsSlice.reducer;
