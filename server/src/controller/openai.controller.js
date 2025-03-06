const { generateResponse } = require('../services/openai.service');

/**
 * Controlador para manejar las solicitudes de chat.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 */

const sendPrompt = async (req, res) => {
    try {
        const { prompt } = req.body; // Obtén el prompt desde el cuerpo de la solicitud

        if (!prompt) {
            return res.status(400).json({ error: 'El prompt es requerido' });
        }

        // Llama al servicio para generar la respuesta
        const response = await generateResponse(prompt);

        // Devuelve la respuesta generada
        res.json({ response });
    } catch (error) {
        console.error('Error en el controlador de chat:', error);
        res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
};

module.exports = {
    sendPrompt,
};