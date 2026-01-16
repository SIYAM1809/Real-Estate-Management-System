import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import propertyService from './propertyService';

const initialState = {
  properties: [],      // Used for lists (All houses OR My houses)
  property: {},        // Used for single house details
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Get all properties (Public)
export const getProperties = createAsyncThunk('properties/getAll', async (_, thunkAPI) => {
  try {
    return await propertyService.getProperties();
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Get MY properties (Seller)
export const getMyProperties = createAsyncThunk('properties/getMy', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await propertyService.getMyProperties(token);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Get Single Property
export const getProperty = createAsyncThunk('properties/getOne', async (id, thunkAPI) => {
  try {
    return await propertyService.getProperty(id);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Create Property
export const createProperty = createAsyncThunk('properties/create', async (propertyData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await propertyService.createProperty(propertyData, token);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Delete Property
export const deleteProperty = createAsyncThunk('properties/delete', async (id, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    await propertyService.deleteProperty(id, token);
    return id; // Return the ID so we can remove it from the UI immediately
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const propertySlice = createSlice({
  name: 'property',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Get All
      .addCase(getProperties.pending, (state) => { state.isLoading = true; })
      .addCase(getProperties.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.properties = action.payload;
      })
      .addCase(getProperties.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get My Properties
      .addCase(getMyProperties.pending, (state) => { state.isLoading = true; })
      .addCase(getMyProperties.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.properties = action.payload; // Update the list with MY houses
      })
      .addCase(getMyProperties.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get Single
      .addCase(getProperty.pending, (state) => { state.isLoading = true; })
      .addCase(getProperty.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.property = action.payload;
      })
      .addCase(getProperty.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Create
      .addCase(createProperty.pending, (state) => { state.isLoading = true; })
      .addCase(createProperty.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.properties.push(action.payload);
      })
      .addCase(createProperty.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Delete
      .addCase(deleteProperty.pending, (state) => { state.isLoading = true; })
      .addCase(deleteProperty.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Remove the deleted item from the list instantly
        state.properties = state.properties.filter((prop) => prop._id !== action.payload);
      })
      .addCase(deleteProperty.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = propertySlice.actions;
export default propertySlice.reducer;