const { OpenAI } = require('openai');
// require('dotenv').config();

// Configura la API de OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Usa una variable de entorno para la API Key
});

/**
 * Servicio para interactuar con la API de OpenAI.
 * @param {string} prompt - El prompt que se enviará a OpenAI.
 * @returns {Promise<string>} - La respuesta generada por OpenAI.
 */

const generateResponse = async (prompt) => {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // Modelo a utilizar
            messages: [{ role: "user", content: prompt }],
            max_tokens: 150, // Límite de tokens en la respuesta
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error('Error en el servicio de OpenAI:', error);
        throw new Error('Error al generar la respuesta con OpenAI');
    }
};

module.exports = {
    generateResponse,
};