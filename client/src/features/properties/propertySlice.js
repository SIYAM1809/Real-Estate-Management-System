import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import propertyService from './propertyService';

const initialState = {
  properties: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Create new property
export const createProperty = createAsyncThunk(
  'properties/create',
  async (propertyData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await propertyService.createProperty(propertyData, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const propertySlice = createSlice({
  name: 'property',
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
      .addCase(createProperty.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createProperty.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.properties.push(action.payload);
      })
      .addCase(createProperty.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = propertySlice.actions;
export default propertySlice.reducer;