import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import propertyService from "./propertyService";

const initialState = {
  properties: [],
  property: {},
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// Public (optional): get approved properties via redux
export const getProperties = createAsyncThunk(
  "properties/getAll",
  async (filters, thunkAPI) => {
    try {
      return await propertyService.getProperties(filters);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Public: get single property
export const getProperty = createAsyncThunk(
  "properties/getOne",
  async (id, thunkAPI) => {
    try {
      return await propertyService.getProperty(id);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Seller: create property
export const createProperty = createAsyncThunk(
  "properties/create",
  async (formData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await propertyService.createProperty(formData, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Seller: update property
export const updateProperty = createAsyncThunk(
  "properties/update",
  async ({ id, updates }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await propertyService.updateProperty(id, updates, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Seller: delete property
export const deleteProperty = createAsyncThunk(
  "properties/delete",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      await propertyService.deleteProperty(id, token);
      return id;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Seller: my listings
export const getMyProperties = createAsyncThunk(
  "properties/myListings",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await propertyService.getMyProperties(token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const propertySlice = createSlice({
  name: "properties",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // getProperties
      .addCase(getProperties.pending, (state) => {
        state.isLoading = true;
      })
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

      // getProperty
      .addCase(getProperty.pending, (state) => {
        state.isLoading = true;
      })
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

      // createProperty
      .addCase(createProperty.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createProperty.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.properties.unshift(action.payload);
      })
      .addCase(createProperty.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // updateProperty
      .addCase(updateProperty.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProperty.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.properties = state.properties.map((p) =>
          p._id === action.payload._id ? action.payload : p
        );
      })
      .addCase(updateProperty.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // deleteProperty
      .addCase(deleteProperty.fulfilled, (state, action) => {
        state.properties = state.properties.filter((p) => p._id !== action.payload);
      })
      .addCase(deleteProperty.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
      })

      // getMyProperties
      .addCase(getMyProperties.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMyProperties.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.properties = action.payload;
      })
      .addCase(getMyProperties.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = propertySlice.actions;
export default propertySlice.reducer;
