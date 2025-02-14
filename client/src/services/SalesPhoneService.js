import api from './InterceptorService';

const SalesPhoneService = {
  getAllSalesPhones: async () => {
    try {
      const response = await api.get('salesman');
      return response.data;
    } catch (error) {
      console.error('Error getting all sales phones:', error);
      throw error;
    }
  },

  addSalesPhone: async (data) => {    
    try {
      const response = await api.post('salesman', data);
      return response.data;
    } catch (error) {
      console.error('Error adding sales phone:', error);
      throw error;
    }
  },

  getSalesPhoneById: async (id) => {
    try {
      const response = await api.get(`salesman/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error getting sales phone by ID:', error);
      throw error;
    }
  },

  deleteSalesPhone: async (id) => {
    try {
      await api.delete(`salesman/${id}`);
    } catch (error) {
      console.error('Error deleting sales phone:', error);
      throw error;
    }
  },

  updateSalesPhone: async (id, phone, name) => {
    try {
      const response = await api.put(`salesman/${id}`, { phone, name });
      return response.data;
    } catch (error) {
      console.error('Error updating sales phone:', error);
      throw error;
    }
  },
};

export { SalesPhoneService };