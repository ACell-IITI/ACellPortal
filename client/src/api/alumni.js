import axios from "axios";

const appEnv = import.meta.env.VITE_APP_ENV || import.meta.env.MODE || "development";
const localApiUrl = import.meta.env.VITE_API_LOCAL_URL || "http://localhost:3000";
const prodApiUrl = import.meta.env.VITE_API_PROD_URL || "https://alumnicell.iiti.ac.in";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() ||
  (appEnv === "production" ? prodApiUrl : localApiUrl);

export const getKyaProfiles = async () => {
  const res = await axios.get(`${API_BASE_URL}/api/get/kya-profiles`);
  return res.data;
};

export const addKyaProfile = async (alumniData) => {
  const res = await axios.post(`${API_BASE_URL}/api/add/kya-profile`, alumniData);
  return res.data;
};

export const deleteKyaProfile = async (id) => {
  const res = await axios.delete(`${API_BASE_URL}/api/delete/kya-profile/${id}`);
  return res.data;
};
