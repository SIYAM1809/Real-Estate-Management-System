import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import adminService from './adminService';

const initialState = {
  pendingProperties: [],
  isLoading: false,
  isError: false,
  message: '',
};

// Get pending properties
export const getPending = createAsyncThunk('admin/getPending', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await adminService.getPending(token);
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

// Approve property
export const approveProperty = createAsyncThunk('admin/approve', async (id, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    await adminService.approve(id, token);
    return id; // Return ID so we can remove it from the list immediately
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

// Reject property
export const rejectProperty = createAsyncThunk('admin/reject', async (id, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    await adminService.reject(id, token);
    return id;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPending.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPending.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pendingProperties = action.payload;
      })
      .addCase(approveProperty.fulfilled, (state, action) => {
        state.pendingProperties = state.pendingProperties.filter(
          (prop) => prop._id !== action.payload
        );
      })
      .addCase(rejectProperty.fulfilled, (state, action) => {
        state.pendingProperties = state.pendingProperties.filter(
          (prop) => prop._id !== action.payload
        );
      });
  },
});

export const { reset } = adminSlice.actions;
export default adminSlice.reducer;