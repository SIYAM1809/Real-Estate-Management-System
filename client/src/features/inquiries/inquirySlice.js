import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import inquiryService from './inquiryService';

const initialState = {
  inquiries: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Create new inquiry
export const createInquiry = createAsyncThunk(
  'inquiries/create',
  async (inquiryData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
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

// Get my inquiries
export const getMyInquiries = createAsyncThunk(
  'inquiries/getAll',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
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

export const inquirySlice = createSlice({
  name: 'inquiry',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
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
      });
  },
});

export const { reset } = inquirySlice.actions;
export default inquirySlice.reducer;