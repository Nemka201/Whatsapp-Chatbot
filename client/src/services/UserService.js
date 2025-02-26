import api from './InterceptorService';

const handleError = (error) => {
  console.error('Error in user service:', error);
};

// User service functions
const UserService = {
  createUser: async (userData) => {
    try {
      const response = await api.post('/api/users/register', userData);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  loginUser: async (usuario, contrasena) => {
    try {
      const response = await api.post('/api/users/login', { usuario, contrasena });
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  getUserById: async (id) => {
    try {
      const response = await api.get(`/api/users/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  userCount: async () => {
    try {
        const response = await api.get(`/api/users/count`);
        return response.data.count;
    } catch (error) {
        handleError(error);
        throw error;
    }
  }
};

export { UserService };