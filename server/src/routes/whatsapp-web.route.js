const express = require('express');
const router = express.Router();
const whatsappController = require('../controller/whatsapp-web.controller');

// Whatsapp routes
router.post('/send', whatsappController.sendMessage);
router.get('/initialize', whatsappController.initializeClient);
router.get('/messages', (req, res) => {
  res.json({ messages: whatsappController.receivedMessages });
});
router.get('/qr', whatsappController.getQRCode);
router.get('/status', whatsappController.isActive);
router.delete('/stop', whatsappController.stopBot);


module.exports = router;