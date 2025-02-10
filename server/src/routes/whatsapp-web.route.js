const express = require('express');
const router = express.Router();
const whatsappController = require('../controller/whatsapp-web.controller');

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

// Endpoint for Initialize bot
router.get('/initialize', whatsappController.initializeClient);

// Endpoint to get received messages
router.get('/messages', (req, res) => {
  res.json({ messages: whatsappController.receivedMessages });
});

// Endpoint to get bot status
router.get('/status', whatsappController.isActive);

// Endpoint to stop bot
router.delete('/stop', whatsappController.stopBot);


module.exports = router;