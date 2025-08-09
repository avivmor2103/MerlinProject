import api from './api';

const register = async (email, password) => {
    const response = await api.post('/api/auth/register', { email, password });
    return response.data;
};

const login = async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
    }
    return response.data;
};

const logout = () => {
    localStorage.removeItem('token');
};

const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};

export {
    register,
    login,
    logout,
    isAuthenticated
}; 