import axios from './axios';

export const searchMedicines = async (name) => {
  const response = await axios.get(`/medicines/search?name=${encodeURIComponent(name)}`);
  return response.data;
};

export const getMedicineDetails = async (id) => {
  const response = await axios.get(`/medicines/${id}`);
  return response.data;
};

export const getMedicineSubstitutes = async (id) => {
  const response = await axios.get(`/medicines/${id}/substitutes`);
  return response.data;
};
