import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Match backend model
interface SessionBooking {
  id: string;
  userId: string;
  session_id: string;
  expires: string;
  meet_link?: string;
  cancelled: boolean;
  payment_status: 'pending' | 'completed' | 'failed';
  createdAt?: string;
  updatedAt?: string;
}

interface SessionBookingState {
  bookings: SessionBooking[];
  loading: boolean;
  error: string | null;
}

const initialState: SessionBookingState = {
  bookings: [],
  loading: false,
  error: null,
};

export const fetchMyBookings = createAsyncThunk(
  'sessionBooking/fetchMyBookings',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('/api/session/booking/getAll');
      // Backend returns { success, message, bookings }
      return res.data.bookings;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const bookSession = createAsyncThunk(
  'sessionBooking/bookSession',
  async (payload: { session_id: string; payment_status?: string }, { rejectWithValue }) => {
    try {
      const res = await axios.post('/api/session/booking/book', payload);
      // Backend returns { success, message, booking }
      return res.data.booking;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const cancelBooking = createAsyncThunk(
  'session/booking/cancelBooking',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/session/booking/cancel/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const sessionBookingSlice = createSlice({
  name: 'sessionBooking',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(bookSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bookSession.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings.push(action.payload);
      })
      .addCase(bookSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(cancelBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = state.bookings.filter(b => b.id !== action.payload);
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default sessionBookingSlice.reducer;
