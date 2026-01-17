import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import inquiryService from './inquiryService';

const initialState = {
  inquiries: [],     // seller inbox
  requests: [],      // buyer "my requests"
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

const getToken = (thunkAPI) => thunkAPI.getState()?.auth?.user?.token;

// Create new inquiry (buyer)
export const createInquiry = createAsyncThunk(
  'inquiries/create',
  async (inquiryData, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
      return await inquiryService.createInquiry(inquiryData, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Seller inbox
export const getMyInquiries = createAsyncThunk(
  'inquiries/getMyInquiries',
  async (_, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
      return await inquiryService.getMyInquiries(token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Buyer requests
export const getMyRequests = createAsyncThunk(
  'inquiries/getMyRequests',
  async (_, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
      return await inquiryService.getMyRequests(token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Seller responds to appointment
export const respondToAppointment = createAsyncThunk(
  'inquiries/respondToAppointment',
  async ({ inquiryId, payload }, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
      return await inquiryService.respondToAppointment(inquiryId, payload, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const inquirySlice = createSlice({
  name: 'inquiries',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // create
      .addCase(createInquiry.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createInquiry.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(createInquiry.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // seller inbox
      .addCase(getMyInquiries.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMyInquiries.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.inquiries = action.payload;
      })
      .addCase(getMyInquiries.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // buyer requests
      .addCase(getMyRequests.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMyRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.requests = action.payload;
      })
      .addCase(getMyRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // seller respond
      .addCase(respondToAppointment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(respondToAppointment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        // update seller inbox list in-place if present
        const updated = action.payload?.inquiry;
        if (updated) {
          state.inquiries = state.inquiries.map((x) => (x._id === updated._id ? updated : x));
        }
      })
      .addCase(respondToAppointment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = inquirySlice.actions;
export default inquirySlice.reducer;
