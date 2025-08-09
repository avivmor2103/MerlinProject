import api from './api';

const addProfile = async (username, email) => {
    try {
        const response = await api.post('/api/tracker/profiles', { username, email });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to add profile');
    }
};

const getProfiles = async () => {
    try {
        const response = await api.get('/api/tracker/profiles');
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch profiles');
    }
};

const removeProfile = async (id) => {
    try {
        const response = await api.delete(`/api/tracker/profiles/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to remove profile');
    }
};

export {
    addProfile,
    getProfiles,
    removeProfile
}; 