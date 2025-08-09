import api from './api';

const addProfile = async (username, email) => {
    const response = await api.post('/api/tracker/profiles', { username, email });
    return response.data;
};

const getProfiles = async () => {
    const response = await api.get('/api/tracker/profiles');
    return response.data;
};

const removeProfile = async (id) => {
    const response = await api.delete(`/api/tracker/profiles/${id}`);
    return response.data;
};

export {
    addProfile,
    getProfiles,
    removeProfile
}; 