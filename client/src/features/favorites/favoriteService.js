import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users/favorites/';

// Get user favorites
const getFavorites = async (token) => {
  if (!token) {
    throw new Error('No authentication token found. Please login again.');
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL, config);
  return response.data;
};

// Toggle Favorite (Add/Remove)
const toggleFavorite = async (propertyId, token) => {
  // 1. Safety Check: Do we actually have a badge?
  if (!token) {
    console.error("TOGGLE FAILED: Token is missing!");
    throw new Error('No authentication token found. Please login again.');
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // 2. Correct PUT Request (Url, Data, Config)
  const response = await axios.put(API_URL + propertyId, {}, config);
  return response.data;
};

const favoriteService = {
  getFavorites,
  toggleFavorite,
};

export default favoriteService;