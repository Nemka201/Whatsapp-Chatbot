const api = require('./InterceptorService');

const handleError = (error) => {
  console.error('Error in user service:', error);
};

// User service functions
const UserService = {
  createUser: async (nombreCompleto, numeroTelefono, usuario, contrasena) => {
    try {
      const response = await api.post('/users', {
        nombreCompleto,
        numeroTelefono,
        usuario,
        contrasena,
      });
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  loginUser: async (usuario, contrasena) => {
    try {
      const response = await api.post('/users/login', { usuario, contrasena });
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  getUserById: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  userCount: async () => {
    try {
        const response = await api.get(`/users/count`)
    } catch (error) {
        handleError(error);
        throw error;
    }
  }
};

export { UserService };