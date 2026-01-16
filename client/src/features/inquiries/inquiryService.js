import axios from 'axios';

const API_URL = 'http://localhost:5000/api/inquiries/';

// Create new inquiry
const createInquiry = async (inquiryData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL, inquiryData, config);
  return response.data;
};

// Get user inquiries (Inbox)
const getMyInquiries = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + 'my-inquiries', config);
  return response.data;
};

const inquiryService = {
  createInquiry,
  getMyInquiries,
};

export default inquiryService;