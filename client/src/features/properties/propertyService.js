import axios from "axios";
import { API_BASE } from "../../utils/apiBase";

const API_URL = `${API_BASE}/api/properties/`;

// Public: approved listings (if you ever use it from Redux)
const getProperties = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.keyword) params.set("keyword", filters.keyword);
  if (filters.city) params.set("city", filters.city);
  if (filters.category) params.set("category", filters.category);
  if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);

  const qs = params.toString();
  const res = await axios.get(qs ? `${API_URL}?${qs}` : API_URL);
  return res.data;
};

// Public: single property
const getProperty = async (id) => {
  const res = await axios.get(`${API_URL}${id}`);
  return res.data;
};

// Seller: create property (multipart)
const createProperty = async (formData, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const res = await axios.post(API_URL, formData, config);
  return res.data;
};

// Seller: update own property
const updateProperty = async (id, updates, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const res = await axios.put(`${API_URL}${id}`, updates, config);
  return res.data;
};

// Seller: delete own property
const deleteProperty = async (id, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const res = await axios.delete(`${API_URL}${id}`, config);
  return res.data;
};

// Seller: my listings
const getMyProperties = async (token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const res = await axios.get(`${API_URL}my-listings`, config);
  return res.data;
};

export default {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
};
