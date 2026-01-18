import axios from "axios";
import { API_BASE } from "../../utils/apiBase";

const API_URL = `${API_BASE}/api/inquiries/`;

// Buyer sends inquiry
const createInquiry = async (inquiryData, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const res = await axios.post(API_URL, inquiryData, config);
  return res.data;
};

// Seller inbox
const getMyInquiries = async (token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const res = await axios.get(`${API_URL}my-inquiries`, config);
  return res.data;
};

// Buyer "sent inquiries"
const getMySentInquiries = async (token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const res = await axios.get(`${API_URL}my-sent`, config);
  return res.data;
};

// Seller action on appointment/inquiry (confirm/propose/reject etc.)
const sellerAction = async (inquiryId, actionData, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const res = await axios.put(`${API_URL}${inquiryId}/seller-action`, actionData, config);
  return res.data;
};

// Buyer action (accept/reject after seller responds) ✅ canonical endpoint
const buyerAction = async (inquiryId, actionData, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };

  // canonical route (matches backend)
  try {
    const res = await axios.put(`${API_URL}${inquiryId}/buyer-response`, actionData, config);
    return res.data;
  } catch (err) {
    // backward compat fallback (if backend is not updated for some reason)
    const res2 = await axios.put(`${API_URL}${inquiryId}/buyer-action`, actionData, config);
    return res2.data;
  }
};

export default {
  createInquiry,
  getMyInquiries,
  getMySentInquiries,
  sellerAction,
  buyerAction,
};
