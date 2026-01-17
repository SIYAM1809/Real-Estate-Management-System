import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import propertyReducer from '../features/properties/propertySlice';
import inquiryReducer from '../features/inquiries/inquirySlice';
import favoriteReducer from '../features/favorites/favoriteSlice'; // <--- Ensure this path is correct
import reviewReducer from '../features/reviews/reviewSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    properties: propertyReducer,
    inquiries: inquiryReducer,
    favorites: favoriteReducer,
    reviews: reviewReducer, // ✅ add

  },
});