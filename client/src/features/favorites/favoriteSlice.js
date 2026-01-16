import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import favoriteService from './favoriteService';

const initialState = {
  favorites: [],
  isLoading: false,
  isError: false,
  message: '',
};

// Get User Favorites
export const getFavorites = createAsyncThunk(
  'favorites/getAll',
  async (_, thunkAPI) => {
    try {
      const user = thunkAPI.getState()?.auth?.user;

      if (!user?.token) {
        throw new Error('No authentication token found. Please login again.');
      }

      return await favoriteService.getFavorites(user.token);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Toggle Favorite
export const toggleFavorite = createAsyncThunk(
  'favorites/toggle',
  async (propertyId, thunkAPI) => {
    try {
      const user = thunkAPI.getState()?.auth?.user;

      if (!user?.token) {
        throw new Error('No authentication token found. Please login again.');
      }

      return await favoriteService.toggleFavorite(propertyId, user.token);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const favoriteSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    reset: () => initialState, // ✅ correct reset
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFavorites.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(getFavorites.fulfilled, (state, action) => {
        state.isLoading = false;
        state.favorites = action.payload;
      })
      .addCase(getFavorites.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(toggleFavorite.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        state.isLoading = false;
        state.favorites = action.payload?.favorites || [];
      })
      .addCase(toggleFavorite.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = favoriteSlice.actions;
export default favoriteSlice.reducer;
