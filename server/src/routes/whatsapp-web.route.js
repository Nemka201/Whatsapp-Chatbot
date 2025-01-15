const express = require('express');
const router = express.Router();
const whatsappController = require('./whatsapp.controller');

// Endpoint to send a WhatsApp message
router.post('/send', async (req, res) => {
  const { numeroDestino, mensaje } = req.body;

  try {
    const response = await whatsappController.sendMessage(numeroDestino, mensaje);
    res.json({ message: 'Mensaje enviado', response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to get received messages
router.get('/messages', (req, res) => {
  res.json({ messages: whatsappController.receivedMessages });
});

module.exports = router;