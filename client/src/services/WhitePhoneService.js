import api from './InterceptorService';

const WhitePhoneService = {
  getAllWhitePhones: async () => {
    try {
      const response = await api.get('/white-phones');
      return response.data;
    } catch (error) {
      console.error('Error getting all white phones:', error);
      throw error;
    }
  },

  addWhitePhone: async (data) => {
    try {
      const response = await api.post('/white-phones', { phone: data.number, name: data.name });
      return response.data;
    } catch (error) {
      console.error('Error adding white phone:', error);
      throw error;
    }
  },

  getWhitePhoneById: async (id) => {
    try {
      const response = await api.get(`/white-phones/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error getting white phone by ID:', error);
      throw error;
    }
  },

  deleteWhitePhone: async (id) => {
    try {
      await api.delete(`/white-phones/${id}`);
    } catch (error) {
      console.error('Error deleting white phone:', error);
      throw error;
    }
  },

  updateWhitePhone: async (id, number, name) => {
    try {
      const response = await api.put(`/white-phones/${id}`, { number, name });
      return response.data;
    } catch (error) {
      console.error('Error updating white phone:', error);
      throw error;
    }
  },
};

export { WhitePhoneService };