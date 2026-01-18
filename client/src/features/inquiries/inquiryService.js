import axios from "axios";
import { API_BASE } from "../../utils/apiBase";

const API_URL = `${API_BASE}/api/inquiries/`;

// Buyer sends inquiry
const createInquiry = async (inquiryData, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.post(API_URL, inquiryData, config);
  return response.data;
};

// Seller inbox
const getMyInquiries = async (token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.get(`${API_URL}my-inquiries`, config);
  return response.data;
};

// Buyer sent inquiries (ONLY if your backend route exists, see below)
const getMySent = async (token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.get(`${API_URL}my-sent`, config);
  return response.data;
};

export default {
  createInquiry,
  getMyInquiries,
  getMySent,
};
