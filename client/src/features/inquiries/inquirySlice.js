import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import inquiryService from './inquiryService';

const initialState = {
  inquiries: [],       // seller inbox
  sentInquiries: [],   // buyer sent list
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Buyer: create inquiry
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

// Seller: inbox
export const getMyInquiries = createAsyncThunk(
  'inquiries/getSellerInbox',
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

// Buyer: sent
export const getMySentInquiries = createAsyncThunk(
  'inquiries/getBuyerSent',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await inquiryService.getMySentInquiries(token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Seller: propose/accept_requested/reject
export const sellerActionOnAppointment = createAsyncThunk(
  'inquiries/sellerAction',
  async ({ inquiryId, payload }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await inquiryService.sellerActionOnAppointment(inquiryId, payload, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Buyer: accept/reject
export const buyerRespondToAppointment = createAsyncThunk(
  'inquiries/buyerRespond',
  async ({ inquiryId, payload }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await inquiryService.buyerRespondToAppointment(inquiryId, payload, token);
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
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // create inquiry
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

      // buyer sent
      .addCase(getMySentInquiries.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMySentInquiries.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.sentInquiries = action.payload;
      })
      .addCase(getMySentInquiries.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // seller action
      .addCase(sellerActionOnAppointment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sellerActionOnAppointment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        const updated = action.payload?.inquiry;
        if (updated?._id) {
          state.inquiries = state.inquiries.map((x) => (x._id === updated._id ? updated : x));
        }
      })
      .addCase(sellerActionOnAppointment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // buyer response
      .addCase(buyerRespondToAppointment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(buyerRespondToAppointment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        const updated = action.payload?.inquiry;
        if (updated?._id) {
          state.sentInquiries = state.sentInquiries.map((x) => (x._id === updated._id ? updated : x));
        }
      })
      .addCase(buyerRespondToAppointment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = inquirySlice.actions;
export default inquirySlice.reducer;
