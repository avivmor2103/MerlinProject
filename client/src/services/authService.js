import axios from 'axios';

const API_URL = 'http://localhost:5001/api/auth';

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'An error occurred' };
  }
};

export const register = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'An error occurred' };
  }
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
}; 