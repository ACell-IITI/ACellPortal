import axios from "axios";
const API_BASE_URL = "http://localhost:8000/api";

export const getKyaProfiles = async () => {
  const res = await axios.get(`${API_BASE_URL}/get/kya-profiles`);
  return res.data;
};

export const addKyaProfile = async (alumniData) => {
  const res = await axios.post(`${API_BASE_URL}/add/kya-profile`, alumniData);
  return res.data;
};

export const deleteKyaProfile = async (id) => {
  const res = await axios.delete(`${API_BASE_URL}/delete/kya-profile/${id}`);
  return res.data;
};
