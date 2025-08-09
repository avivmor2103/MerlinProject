import axios from 'axios';

const API_URL = 'http://localhost:5001/api/tracker';

// Create axios instance with auth header
const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add auth token to requests
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const addProfile = async (username, email) => {
    try {
        const response = await axiosInstance.post('/profiles', { username, email });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error.response?.data || { message: 'An error occurred' };
    }
};

export const getProfiles = async () => {
    try {
        const response = await axiosInstance.get('/profiles');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'An error occurred' };
    }
};

export const removeProfile = async (id) => {
    try {
        const response = await axiosInstance.delete(`/profiles/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'An error occurred' };
    }
}; 