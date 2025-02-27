import api from './InterceptorService';

const handleError = (error) => {
  console.error('Error in user service:', error);
};

const apiPath = 'users/';


// User service functions
const UserService = {
  createUser: async (userData) => {
    try {
      const response = await api.post(apiPath + 'register', userData);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  loginUser: async (usuario, contrasena) => {
    try {
      const response = await api.post(apiPath + 'login', { usuario, contrasena });
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  getUserById: async (id) => {
    try {
      const response = await api.get(apiPath + id);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  userCount: async () => {
    try {
        const response = await api.get(apiPath + 'count');
        return response.data.count;
    } catch (error) {
        handleError(error);
        throw error;
    }
  }
};

export { UserService };