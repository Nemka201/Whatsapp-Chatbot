const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

function generarRespuesta(opciones) {
    let respuesta = 'Selecciona una opción:\n';
    let i = 1;
    for (const opcion in opciones) {
        respuesta += `${i}. ${opcion}\n`;
        i++;
    }
    return respuesta;
}

const client = new Client({
    puppeteer: {
        headless: true,
        executablePath: '/usr/bin/google-chrome-stable',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
    authStrategy: new LocalAuth({
        dataPath: './session', // Path to store session data
    }),
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

const receivedMessages = []; // Array to store received messages

client.on('message_create', message => {
    console.log('Mensaje recibido:', message.body);

    // Save incoming messages
    receivedMessages.push({
        id: message.id._serialized,
        from: message.from,
        body: message.body,
        timestamp: message.timestamp,
    });

    // Handle menu navigation logic here
    if (!message.isGroup) {
        const text = message.body.toLowerCase();
        let currentMenu = menu;
        const partes = text.split(' ');

        partes.forEach(parte => {
            currentMenu = currentMenu[parte];
            if (!currentMenu) {
                message.reply('Opción no válida.');
                return;
            }
        });

        if (typeof currentMenu === 'object') {
            message.reply(generarRespuesta(currentMenu));
        } else {
            message.reply(`Has seleccionado: ${currentMenu}`);
        }
    } else {
        console.log('Mensaje de grupo ignorado');
    }
});

client.initialize();

// Function to send a WhatsApp message
async function sendMessage(numeroDestino, mensaje) {
    if (!numeroDestino || !mensaje) {
        throw new Error('Número de destino y mensaje son requeridos');
    }

    try {
        const chatId = `${numeroDestino}@c.us`;
        const response = await client.sendMessage(chatId, mensaje);
        return response;
    } catch (error) {
        console.error('Error al enviar mensaje:', error);
        throw error; // Re-throw the error for proper handling in the route
    }
}

module.exports = { client, sendMessage, receivedMessages };