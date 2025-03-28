// routes/whatsapp.js
const express = require('express');
const router = express.Router();
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const getSalesPhone = require('../utilities/getSalesman');
const whitePhoneService = require('../services/whitePhone.service');

// Inicializar el cliente de WhatsApp
const client = new Client({
    puppeteer: {
        headless: true,
        executablePath: '/usr/bin/google-chrome-stable',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
    authStrategy: new LocalAuth({
        dataPath: './session' // Ruta donde se almacenará la sesión
    })
});
// Almacenar la última actividad de cada usuario
const lastActivity = new Map();

client.on('message', async message => {
    const chat = await message.getChat();
    const userId = message.from; // Identificar al usuario por su número
    const now = Date.now(); // Timestamp actual en milisegundos
    if (!message.isGroup) {
        const allowedPhones = await whitePhoneService.getAllPhoneNumbers();
        const userNumber = message.from.split('@')[0];
        if (!allowedPhones.includes(userNumber)) {
            // Verificar si hay una última actividad registrada
            if (lastActivity.has(userId)) {
                const lastTimestamp = lastActivity.get(userId); // Última actividad registrada
                const timeElapsed = now - lastTimestamp; // Tiempo transcurrido en milisegundos

                // Si han pasado más de 5 minutos (300,000 ms), enviar automáticamente el menú
                if (timeElapsed > 300000) {
                    message.reply(
                        `*Bienvenido de nuevo al Chatbot* 🤖\n\n` +
                        `1️⃣ Opción 1: Información sobre nuestros servicios.\n` +
                        `2️⃣ Opción 2: Contactar con un vendedor.\n` +
                        `3️⃣ Opción 3: Ver nuestras promociones.\n\n` +
                        `Por favor, responde con el número de la opción que deseas.`
                    );
                }
            }

            // Actualizar la última actividad del usuario
            lastActivity.set(userId, now);

            // Respuesta a opciones
            switch (message.body) {
                case '1':
                    // Enviar información sobre los servicios
                    await message.client.sendMessage(
                        message.from, // El ID del chat del usuario
                        '✅ Aquí tienes información sobre nuestros servicios:\n- Servicio A\n- Servicio B\n...'
                    );
                    break;

                case '2':
                    // Obtener el siguiente vendedor
                    let salesMan = await getSalesPhone.getNextSalesman();

                    // Enviar mensaje con información del vendedor
                    await message.client.sendMessage(
                        message.from,
                        `Nuestro agente ${salesMan.name}\nSu número es: ${salesMan.phone}`
                    );

                    // Enviar mensaje con el enlace de WhatsApp
                    await message.client.sendMessage(
                        message.from,
                        salesMan.whatsappUrl
                    );
                    break;

                case '3':
                    // Enviar promociones
                    await message.client.sendMessage(
                        message.from,
                        '✅ Estas son nuestras promociones actuales:\n- Promoción 1\n- Promoción 2\n...'
                    );
                    break;

                default:
                    // Mensaje de opciones
                    await message.client.sendMessage(
                        message.from,
                        `*Bienvenidos a LUZARA* 🤖\n\n` +
                        `1️⃣ Opción 1: Información sobre nuestros servicios.\n` +
                        `2️⃣ Opción 2: Contactar con vendedores.\n` +
                        `3️⃣ Opción 3: Ver nuestras promociones.\n\n` +
                        `Por favor, responde con el número de la opción que deseas.`
                    );
                    break;
            }


        }
    } else {
        console.log('Mensaje de grupo ignorado');
    }
});

let receivedMessages = []; // Arreglo para almacenar los mensajes recibidos

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message_create', message => {
    console.log('Mensaje recibido:', message.body);

    // Guardar los mensajes entrantes
    receivedMessages.push({
        id: message.id._serialized,
        from: message.from,
        body: message.body,
        timestamp: message.timestamp,
    });
});

client.initialize();

// Endpoint para enviar un mensaje
router.post('/send', async (req, res) => {
    const { numeroDestino, mensaje } = req.body;

    if (!numeroDestino || !mensaje) {
        return res.status(400).json({ error: 'Número de destino y mensaje son requeridos' });
    }

    try {
        const chatId = `${numeroDestino}@c.us`;
        const response = await client.sendMessage(chatId, mensaje);
        res.json({ message: 'Mensaje enviado', response });
    } catch (error) {
        console.error('Error al enviar mensaje:', error);
        res.status(500).json({ error: 'Error al enviar mensaje' });
    }
});

// Endpoint para obtener los mensajes recibidos
router.get('/messages', (req, res) => {
    res.json({ messages: receivedMessages });
});


module.exports = router;
