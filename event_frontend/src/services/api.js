import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
    withCredentials: true, // Send cookies with requests
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor for Debugging
api.interceptors.request.use(
    (config) => {
        console.debug('[API Request]:', config.method.toUpperCase(), config.url);
        return config;
    },
    (error) => {
        console.error('[API Request Error]:', error);
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        console.debug('[API Response]:', response.status, response.config.url);
        return response;
    },
    (error) => {
        console.error('[API Response Error]:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default api;
