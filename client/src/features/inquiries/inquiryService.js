import axios from 'axios';

const API_URL = 'http://localhost:5000/api/inquiries/';

const authConfig = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

// Buyer: create new inquiry
const createInquiry = async (inquiryData, token) => {
  const response = await axios.post(API_URL, inquiryData, authConfig(token));
  return response.data;
};

// Seller: inbox
const getMyInquiries = async (token) => {
  const response = await axios.get(API_URL + 'my-inquiries', authConfig(token));
  return response.data;
};

// Buyer: sent inquiries
const getMySentInquiries = async (token) => {
  const response = await axios.get(API_URL + 'my-sent', authConfig(token));
  return response.data;
};

// Seller: propose / accept_requested / reject
const sellerAction = async (inquiryId, payload, token) => {
  const response = await axios.put(
    API_URL + `${inquiryId}/seller-action`,
    payload,
    authConfig(token)
  );
  return response.data;
};

// Buyer: accept / reject
const buyerRespond = async (inquiryId, payload, token) => {
  const response = await axios.put(
    API_URL + `${inquiryId}/buyer-response`,
    payload,
    authConfig(token)
  );
  return response.data;
};

export default {
  createInquiry,
  getMyInquiries,
  getMySentInquiries,
  sellerAction,
  buyerRespond,
};
