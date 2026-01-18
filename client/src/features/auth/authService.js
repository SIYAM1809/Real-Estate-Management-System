import axios from 'axios';

// Use env in production, fallback to localhost in dev/local
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Keep API path consistent
const API_URL = `${BASE_URL}/api/users`;

// Register user
const register = async (userData) => {
  const response = await axios.post(API_URL, userData);

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem('user');
};

export default {
  register,
  login,
  logout,
};
