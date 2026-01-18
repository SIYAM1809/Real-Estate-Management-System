import axios from "axios";
import { API_BASE } from "../../utils/apiBase";

const API_URL = `${API_BASE}/api/admin/`;

// Get pending properties
const getPending = async (token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.get(API_URL + "pending", config);
  return response.data;
};

// Approve property
const approve = async (id, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.put(API_URL + "approve/" + id, {}, config);
  return response.data;
};

// Reject property
const reject = async (id, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.put(API_URL + "reject/" + id, {}, config);
  return response.data;
};

const adminService = {
  getPending,
  approve,
  reject,
};

export default adminService;
