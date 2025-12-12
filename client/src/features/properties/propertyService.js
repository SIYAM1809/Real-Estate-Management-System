import axios from 'axios';

const API_URL = 'http://localhost:5000/api/properties/';

// Create new property
const createProperty = async (propertyData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      // No need to set Content-Type manually for FormData, axios does it
    },
  };

  const response = await axios.post(API_URL, propertyData, config);

  return response.data;
};

const propertyService = {
  createProperty,
};

export default propertyService;