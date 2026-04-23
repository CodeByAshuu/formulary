// client/src/api/auth.js
import axios from './axios';

export const login = async (email, password) => {
  const response = await axios.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (userData) => {
  const response = await axios.post('/auth/register', userData);
  return response.data;
};
