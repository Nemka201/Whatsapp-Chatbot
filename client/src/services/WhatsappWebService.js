import api from './InterceptorService';

const handleError = (error) => {
  console.error('Error in user service:', error);
};

// User service functions
const WhatsappWebService = {
  stopBot: async () => {
    try {
      const response = await api.delete('/whatsapp-web/stop');
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  initializeBot: async () => {
    try {
      const response = await api.get(`/whatsapp-web/initialize`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getQR: async () => {
    try {
        const response = await api.get(`/whatsapp-web/qr`);
        return response.data.qrCode;
    } catch (error) {
        handleError(error);
        throw error;
    }
  },
  status: async () => {
    try {
        const response = await api.get(`/whatsapp-web/status`);
        return response.data.isActive;
    } catch (error) {
        handleError(error);
        throw error;
    }
  }

};

export { WhatsappWebService };