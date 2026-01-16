import axios from 'axios';

const API_URL = 'http://localhost:5000/api/properties/';

// Get all properties (Public)
const getProperties = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Get single property (Public)
const getProperty = async (propertyId) => {
  const response = await axios.get(API_URL + propertyId);
  return response.data;
};

// Get MY properties (Seller Private)
const getMyProperties = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + 'my-listings', config);
  return response.data;
};

// Create new property (Private)
const createProperty = async (propertyData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  };
  const response = await axios.post(API_URL, propertyData, config);
  return response.data;
};

// Delete property (Private)
const deleteProperty = async (propertyId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.delete(API_URL + propertyId, config);
  return response.data;
};

const propertyService = {
  getProperties,
  getProperty,
  getMyProperties, // <--- New
  createProperty,
  deleteProperty,  // <--- New
};

export default propertyService;