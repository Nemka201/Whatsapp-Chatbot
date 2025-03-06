const express = require('express');
const { sendPrompt } = require('../controller/openai.controller');

const router = express.Router();

/**
 * Ruta para manejar solicitudes de chat.
 * @name POST /chat
 * @function
 * @param {string} path - Ruta del endpoint.
 * @param {callback} middleware - Controlador que maneja la solicitud.
 */

router.post('/chat', sendPrompt);

module.exports = router;