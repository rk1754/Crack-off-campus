import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Session {
  id: string;
  admin_id: string;
  time: string;
  title: string;
  description: string;
  meeting_duration: number;
  ratings: number;
  isBooked: boolean;
  price: number;
  image_url?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface SessionState {
  sessions: Session[];
  selectedSession: Session | null;
  loading: boolean;
  error: string | null;
}

const initialState: SessionState = {
  sessions: [],
  selectedSession: null,
  loading: false,
  error: null,
};

export const fetchSessions = createAsyncThunk(
  'session/fetchSessions',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('/api/session/getAll');
      return res.data.slots;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchSessionById = createAsyncThunk(
  'session/fetchSessionById',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/session/getById/${id}`);
      return res.data.slot;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const createSession = createAsyncThunk(
  'session/createSession',
  async (payload: FormData, { rejectWithValue }) => {
    try {
      const res = await axios.post('/api/session/create', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data.session;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateSession = createAsyncThunk(
  'session/updateSession',
  async ({ id, data }: { id: string; data: Partial<Session> }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`/api/session/update/${id}`, data);
      return { id, ...data };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteSession = createAsyncThunk(
  'session/deleteSession',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/session/delete/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    clearSelectedSession(state) {
      state.selectedSession = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSessions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSessions.fulfilled, (state, action) => {
        state.loading = false;
        state.sessions = action.payload;
      })
      .addCase(fetchSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchSessionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSessionById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSession = action.payload;
      })
      .addCase(fetchSessionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSession.fulfilled, (state, action) => {
        state.loading = false;
        state.sessions.push(action.payload);
      })
      .addCase(createSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSession.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.sessions.findIndex(s => s.id === action.payload.id);
        if (idx !== -1) state.sessions[idx] = { ...state.sessions[idx], ...action.payload };
      })
      .addCase(updateSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSession.fulfilled, (state, action) => {
        state.loading = false;
        state.sessions = state.sessions.filter(s => s.id !== action.payload);
      })
      .addCase(deleteSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedSession } = sessionSlice.actions;
export default sessionSlice.reducer;
