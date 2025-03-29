import axios from 'axios';

const api = axios.create({
    baseURL: "/server/api/"
});

// Agregar interceptor de solicitud
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

// Agregar interceptor de respuesta para manejar tokens expirados
api.interceptors.response.use(
    response => response, // Si la respuesta es correcta, la retorna sin cambios
    error => {
        if (error.response && error.response.status === 401) {
            console.warn("⚠️ Token expirado. Eliminando del localStorage...");
            localStorage.removeItem('token'); // Elimina el token si recibe un 401
        }
        return Promise.reject(error);
    }
);

export default api;
