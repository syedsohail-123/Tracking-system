import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/',
    headers: {
        'Content-Type': 'application/json'
    }
});

export const generateTrip = async (data) => {
    const response = await api.post('generate-trip/', data);
    return response.data;
};

export default api;
