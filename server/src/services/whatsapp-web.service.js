const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

class WhatsAppWebService {
  constructor() {
    this.client = new Client({
      puppeteer: {
        headless: true,
        executablePath: '/usr/bin/google-chrome-stable',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
      authStrategy: new LocalAuth({
        dataPath: './session', // Path to store session data
      }),
    });
    this.isConnected = false;
    this.receivedMessages = [];
    this.initializeClient();
  }

  // Initialize Client
  initializeClient() {
    this.isConnected = true;

    this.client.on('qr', qr => {
      qrcode.generate(qr, { small: true });
    });

    this.client.on('ready', () => {
      console.log('Cliente de WhatsApp listo!');
    });

    this.client.on('message_create', message => {
      console.log('Mensaje recibido:', message.body);

      // Guardar los mensajes recibidos
      this.receivedMessages.push({
        id: message.id._serialized,
        from: message.from,
        body: message.body,
        timestamp: message.timestamp,
      });

      client.on('message', async message => {
        const chat = await message.getChat();
        const userId = message.from;
        const now = Date.now();
        if (this.isConnected) {
          if (!message.isGroup) {
            const userNumber = message.from.split('@')[0];

            if (await isUserAuthorized(userNumber)) {
              if (await shouldSendMenu(userId, now)) {
                await sendMenu(message);
              }

              handleUserResponse(message);
            } else {
              sendUnauthorizedMessage(message);
            }
          } else {
            console.log('Mensaje de grupo ignorado');
          }
        }
      }
      );
    });

    this.client.initialize();
  }
  // Stop whatsapp-web client
  async stopBot() {
    this.isConnected = false;
    console.log('Cliente de WhatsApp cerrado');
  }

  // Verify client is active
  async isActive() {
    return this.isConnected;
  }
}

// Functions //

// Función para generar respuesta en base a las opciones del menú
async function generarRespuesta(opciones) {
  let respuesta = 'Selecciona una opción:\n';
  let i = 1;
  for (const opcion in opciones) {
    respuesta += `${i}. ${opcion}\n`;
    i++;
  }
  return respuesta;
}

// Send message function
async function sendMessage(numeroDestino, mensaje) {
  if (!numeroDestino || !mensaje) {
    throw new Error('Número de destino y mensaje son requeridos');
  }

  try {
    const chatId = `${numeroDestino}@c.us`;
    const response = await this.client.sendMessage(chatId, mensaje);
    return response;
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
    throw error;
  }
}

// Return user messages
async function getReceivedMessages() {
  return this.receivedMessages;
}

// Verify white-list users
async function isUserAuthorized(userNumber) {
  const allowedPhones = await whitePhoneService.getAllPhoneNumbers();
  return allowedPhones.includes(userNumber);
}

// Verify user activity
async function shouldSendMenu(userId, now) {
  if (!lastActivity.has(userId)) {
    return true;
  }

  const lastTimestamp = lastActivity.get(userId);
  const timeElapsed = now - lastTimestamp;
  return timeElapsed > 300000;
}
// Send user menu
async function sendMenu(message) {
  await message.client.sendMessage(
    message.from, // El ID del chat del usuario
    `*Bienvenido de nuevo al Chatbot* 🤖\n\n` +
    `1️⃣ Opción 1: Información sobre nuestros servicios.\n` +
    `2️⃣ Opción 2: Contactar con un vendedor.\n` +
    `3️⃣ Opción 3: Ver nuestras promociones.\n\n` +
    `Por favor, responde con el número de la opción que deseas.`);
}

// Handle response
async function handleUserResponse(message) {
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

// Unauthorized response
async function sendUnauthorizedMessage(message) {
  await message.client.sendMessage(
    message.from,
    '...'
  );
}

// Send image
async function sendImage(chatId, itemId) {
  try {
    const menuItem = await MenuItem.findById(itemId);
    const imagePath = menuItem.imagePath;

    // Si la imagen está almacenada en un servicio de almacenamiento en la nube,
    // obtendrás la URL pública de la imagen en lugar de la ruta local

    const attachment = await MessageMedia.fromFilePath(imagePath);
    await this.client.sendMessage(chatId, attachment);
  } catch (error) {
    console.error('Error al enviar la imagen:', error);
    throw error;
  }
}

module.exports = new WhatsAppWebService();
