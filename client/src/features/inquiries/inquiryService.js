import axios from 'axios';

const API_URL = 'http://localhost:5000/api/inquiries/';

const authConfig = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

// Create new inquiry
const createInquiry = async (inquiryData, token) => {
  const response = await axios.post(API_URL, inquiryData, authConfig(token));
  return response.data;
};

// Seller inbox
const getMyInquiries = async (token) => {
  const response = await axios.get(API_URL + 'my-inquiries', authConfig(token));
  return response.data;
};

// Buyer requests (appointments/messages sent by buyer)
const getMyRequests = async (token) => {
  const response = await axios.get(API_URL + 'my-requests', authConfig(token));
  return response.data;
};

// Seller responds to appointment
const respondToAppointment = async (inquiryId, payload, token) => {
  const response = await axios.put(
    API_URL + `${inquiryId}/appointment-response`,
    payload,
    authConfig(token)
  );
  return response.data; // expected: { message, inquiry }
};

const inquiryService = {
  createInquiry,
  getMyInquiries,
  getMyRequests,
  respondToAppointment,
};

export default inquiryService;
