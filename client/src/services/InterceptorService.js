import axios from 'axios';

const EXPRESS_PORT = 3000;
const api = axios.create({
    // baseURL: `http://localhost:${EXPRESS_PORT}/api/`,http://server:3000/api
    baseURL: 'http://server:3000/api'
    // baseURL: process.env.REACT_APP_API_URL, // Se ajusta automáticamente según la URL del frontend
});

api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export default api;