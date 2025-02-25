import axios from 'axios';

const EXPRESS_PORT = 3000;
const api = axios.create({
    // baseURL: `http://localhost:${EXPRESS_PORT}/api/`,
    baseURL: `/api/`, 

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