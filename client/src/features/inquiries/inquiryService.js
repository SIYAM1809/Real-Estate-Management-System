import axios from 'axios';
import { API_BASE } from '../../utils/apiBase';

const API_URL = `${API_BASE}/api/inquiries/`;

const authConfig = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

// Buyer sends inquiry (appointment only in UI, but backend supports both)
const createInquiry = async (inquiryData, token) => {
  const res = await axios.post(API_URL, inquiryData, authConfig(token));
  return res.data;
};

// Seller inbox
const getMyInquiries = async (token) => {
  const res = await axios.get(`${API_URL}my-inquiries`, authConfig(token));
  return res.data;
};

// Buyer sent inquiries
const getMySentInquiries = async (token) => {
  const res = await axios.get(`${API_URL}my-sent`, authConfig(token));
  return res.data;
};

// Seller action on appointment
const sellerActionOnAppointment = async (inquiryId, actionData, token) => {
  const res = await axios.put(`${API_URL}${inquiryId}/seller-action`, actionData, authConfig(token));
  return res.data;
};

// Buyer response on appointment
const buyerRespondToAppointment = async (inquiryId, actionData, token) => {
  const res = await axios.put(`${API_URL}${inquiryId}/buyer-response`, actionData, authConfig(token));
  return res.data;
};

export default {
  createInquiry,
  getMyInquiries,
  getMySentInquiries,
  sellerActionOnAppointment,
  buyerRespondToAppointment,
};
