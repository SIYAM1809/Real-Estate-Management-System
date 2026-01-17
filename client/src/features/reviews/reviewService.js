import axios from 'axios';

const API_URL = 'http://localhost:5000/api/reviews/';

const getPropertyReviews = async (propertyId) => {
  const res = await axios.get(API_URL + `property/${propertyId}`);
  return res.data;
};

const createReview = async (reviewData, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const res = await axios.post(API_URL, reviewData, config);
  return res.data;
};

const adminGetReviews = async (token, params = {}) => {
  const config = { headers: { Authorization: `Bearer ${token}` }, params };
  const res = await axios.get(API_URL + 'admin', config);
  return res.data;
};

const adminUpdateStatus = async (id, status, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const res = await axios.put(API_URL + `${id}/status`, { status }, config);
  return res.data;
};

const adminDeleteReview = async (id, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const res = await axios.delete(API_URL + id, config);
  return res.data;
};

const reviewService = {
  getPropertyReviews,
  createReview,
  adminGetReviews,
  adminUpdateStatus,
  adminDeleteReview,
};

export default reviewService;
