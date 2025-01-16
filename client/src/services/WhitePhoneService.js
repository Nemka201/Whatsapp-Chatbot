const api = require('./InterceptorService');

// Get all white phones
const getAllSalesPhones = async () => {
    try {
      const response = await api.get('/sales-phones');
      return response.data;
    } catch (error) {
      console.error('Error getting all sales phones:', error);
      throw error;
    }
  };
  
  // Add a new white phone
  const addSalesPhone = async (number, name) => {
    try {
      const response = await api.post('/sales-phones', { number, name });
      return response.data;
    } catch (error) {
      console.error('Error adding sales phone:', error);
      throw error;
    }
  };
  
  // Get a specific white phone by ID
  const getSalesPhoneById = async (id) => {
    try {
      const response = await api.get(`/sales-phones/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error getting sales phone by ID:', error);
      throw error;
    }
  };
  
  // Delete a white phone by ID
  const deleteSalesPhone = async (id) => {
    try {
      await api.delete(`/sales-phones/${id}`);
    } catch (error) {
      console.error('Error deleting sales phone:', error);
      throw error;
    }
  };
  
  // Update a white phone by ID
  const updateSalesPhone = async (id, number, name) => {
    try {
      const response = await api.put(`/sales-phones/${id}`, { number, name });
      return response.data;
    } catch (error) {
      console.error('Error updating sales phone:', error);
      throw error;
    }
  };
  
  export { getAllSalesPhones, addSalesPhone, getSalesPhoneById, deleteSalesPhone, updateSalesPhone };