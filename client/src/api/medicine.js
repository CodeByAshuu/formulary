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

export const bulkUploadMedicines = async (csvData) => {
  const response = await axios.post('/medicines/bulk-upload', { csvData });
  return response.data;
};

export const addMedicine = async (medicineData) => {
  const response = await axios.post('/medicines', medicineData);
  return response.data;
};

export const updateMedicine = async (id, medicineData) => {
  const response = await axios.put(`/medicines/${id}`, medicineData);
  return response.data;
};

export const deleteMedicine = async (id) => {
  const response = await axios.delete(`/medicines/${id}`);
  return response.data;
};
