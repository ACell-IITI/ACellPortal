import axios from "axios";
export const API_BASE_URL = "https://alumnicell.iiti.ac.in:3008";

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
