import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import reviewService from './reviewService';

const initialState = {
  propertyReviews: { count: 0, average: 0, reviews: [] },
  adminReviews: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

export const getPropertyReviews = createAsyncThunk(
  'reviews/getPropertyReviews',
  async (propertyId, thunkAPI) => {
    try {
      return await reviewService.getPropertyReviews(propertyId);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createReview = createAsyncThunk(
  'reviews/create',
  async (reviewData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await reviewService.createReview(reviewData, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const adminGetReviews = createAsyncThunk(
  'reviews/adminGet',
  async (params, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await reviewService.adminGetReviews(token, params);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const adminUpdateReviewStatus = createAsyncThunk(
  'reviews/adminUpdateStatus',
  async ({ id, status }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await reviewService.adminUpdateStatus(id, status, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const adminDeleteReview = createAsyncThunk(
  'reviews/adminDelete',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await reviewService.adminDeleteReview(id, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    resetReviews: () => initialState,

    // ✅ NEW: clear only flags/messages (keep lists)
    clearReviewStatus: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // property reviews
      .addCase(getPropertyReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPropertyReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.propertyReviews = action.payload;
      })
      .addCase(getPropertyReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // ✅ create review (fix success/flag behavior)
      .addCase(createReview.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
      })
      .addCase(createReview.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(createReview.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // admin reviews
      .addCase(adminGetReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(adminGetReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.adminReviews = action.payload;
      })
      .addCase(adminGetReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(adminUpdateReviewStatus.fulfilled, (state, action) => {
        state.adminReviews = state.adminReviews.map((r) =>
          r._id === action.payload._id ? action.payload : r
        );
      })
      .addCase(adminDeleteReview.fulfilled, (state, action) => {
        state.adminReviews = state.adminReviews.filter((r) => r._id !== action.payload.id);
      });
  },
});

export const { resetReviews, clearReviewStatus } = reviewSlice.actions;
export default reviewSlice.reducer;
