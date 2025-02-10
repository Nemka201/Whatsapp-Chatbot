const whatsappWebService = require('../services/whatsapp-web.service');

// Initialize WhatsApp Web client
const initializeClient = async (req, res) => {
  try {
    await whatsappWebService.initializeClient();
    res.status(200).json({ message: 'Cliente de WhatsApp Web inicializado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al inicializar el cliente de WhatsApp Web' });
  }
};

// Stop Whatsapp Web client
const stopBot = async (req, res) => {
  try {
      await whatsappWebService.stopBot();
      res.status(200).json({ message: 'Bot detenido correctamente' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al detener el bot' });
  }
};

// Send message to WhatsApp number
const sendMessage = async (req, res) => {
  const { numeroDestino, mensaje } = req.body;

  try {
    const response = await whatsappWebService.sendMessage(numeroDestino, mensaje);
    res.status(200).json({ message: 'Mensaje enviado exitosamente', response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al enviar el mensaje' });
  }
};

// Obtain received messages
const getReceivedMessages = (req, res) => {
  try {
    const messages = whatsappWebService.getReceivedMessages();
    res.status(200).json({ messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener los mensajes recibidos' });
  }
};

// Get bot status
const isActive = async (req, res) => {
  try {
    const active = await whatsappWebService.isActive();
    res.status(200).json({ isActive: active });
  } catch (err) {
    console.error('Error al obtener el estado del cliente:', err);
    res.status(500).json({ error: 'Error al obtener el estado del cliente' });
  }
};


module.exports = { initializeClient, stopBot, sendMessage, getReceivedMessages, isActive };
