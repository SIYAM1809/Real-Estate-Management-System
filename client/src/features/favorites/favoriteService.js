// client/src/features/favorites/favoriteService.js
import axios from "axios";
import { API_BASE } from "../../utils/apiBase";

const API_URL = `${API_BASE}/api/users/favorites/`;

// Get user favorites
const getFavorites = async (token) => {
  if (!token) throw new Error("No authentication token found. Please login again.");

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const response = await axios.get(API_URL, config);
  return response.data;
};

// Toggle Favorite (Add/Remove)
const toggleFavorite = async (propertyId, token) => {
  if (!token) throw new Error("No authentication token found. Please login again.");

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const response = await axios.put(`${API_URL}${propertyId}`, {}, config);
  return response.data;
};

export default {
  getFavorites,
  toggleFavorite,
};
