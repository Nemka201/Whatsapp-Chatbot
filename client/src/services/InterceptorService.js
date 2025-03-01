import axios from 'axios';

// const URL = process.env.REACT_APP_API_URL 

const api = axios.create({
    // baseURL: `http://localhost:${EXPRESS_PORT}/api/`,
    // baseURL: `http://server:${EXPRESS_PORT}/api/`, 
    baseURL: "/server/api/"
});

api.interceptors.request.use(
    config => {
        console.log('Api:', api.baseURL);
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