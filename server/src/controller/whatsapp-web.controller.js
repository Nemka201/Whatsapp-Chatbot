const whatsappWebService = require('../services/whatsapp-web.service');

// Inicializar cliente de WhatsApp Web
const initializeClient = (req, res) => {
  try {
    whatsappWebService.initializeClient();
    res.status(200).json({ message: 'Cliente de WhatsApp Web inicializado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al inicializar el cliente de WhatsApp Web' });
  }
};

// Enviar mensaje a un número de WhatsApp
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

// Obtener mensajes recibidos
const getReceivedMessages = (req, res) => {
  try {
    const messages = whatsappWebService.getReceivedMessages();
    res.status(200).json({ messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener los mensajes recibidos' });
  }
};

module.exports = { initializeClient, sendMessage, getReceivedMessages };
