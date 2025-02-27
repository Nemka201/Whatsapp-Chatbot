import api from './InterceptorService';

const apiPath = 'salesman/';


const SalesPhoneService = {
  getAllSalesPhones: async () => {
    try {
      const response = await api.get(apiPath);
      return response.data;
    } catch (error) {
      console.error('Error getting all sales phones:', error);
      throw error;
    }
  },

  addSalesPhone: async (data) => {    
    try {
      const response = await api.post(apiPath, data);
      return response.data;
    } catch (error) {
      console.error('Error adding sales phone:', error);
      throw error;
    }
  },

  getSalesPhoneById: async (id) => {
    try {
      const response = await api.get(apiPath+id);
      return response.data;
    } catch (error) {
      console.error('Error getting sales phone by ID:', error);
      throw error;
    }
  },

  deleteSalesPhone: async (id) => {
    try {
      await api.delete(apiPath+id);
    } catch (error) {
      console.error('Error deleting sales phone:', error);
      throw error;
    }
  },

  updateSalesPhone: async (id, phone, name, whatsappUrl) => {
    try {
      const response = await api.put(apiPath+id, { phone, name, whatsappUrl });
      return response.data;
    } catch (error) {
      console.error('Error updating sales phone:', error);
      throw error;
    }
  },
};

export { SalesPhoneService };