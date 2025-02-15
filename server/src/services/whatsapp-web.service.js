const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const qrcode64 = require('qrcode');
const fs = require('fs');
const whitePhoneService = require('../services/whitePhone.service');
const menuItemService = require('../services/menuItem.service');
const { getNextSalesman } = require('../utilities/getSalesman');

class WhatsAppWebService {
  constructor() {
    const path = './app/whatsapp-session';

    this.client = new Client({
      puppeteer: {
        headless: true,
        executablePath: '/usr/bin/google-chrome-stable',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
      authStrategy: new LocalAuth({
        dataPath: path,
      }),
    });

    this.lastActivity = new Map(); 
    if (fs.existsSync('whatsapp-session')) {
      console.log('✅ Carpeta de sesión encontrada');
    } else {
      console.error('❌ La carpeta de sesión no se está creando correctamente');
      this.initializeClient();
    }
    this.isConnected = false;
    this.receivedMessages = [];
  }

  // Inicializar el cliente
  initializeClient() {
    this.client.on('qr', (qr) => {
      qrcode64.toDataURL(qr, { errorCorrectionLevel: 'H' }, (err, url) => {
        if (err) {
          console.error('Error generando QR:', err);
          return;
        }
        this.qrCode = url;
      });
      qrcode.generate(qr, { small: true });
    });

    this.client.on('ready', () => {
      console.log('✅ Cliente de WhatsApp listo!');
      this.isConnected = true;

    });

    this.client.on('disconnected', () => {
      console.log('⚠️ Cliente de WhatsApp desconectado');
      this.isConnected = false;
      this.qrCode = null;
    });

    // Escuchar mensajes
    this.client.on('message', async (message) => {
      await this.handleIncomingMessage(message);
    });

    this.client.initialize();
  }

  // Manejar mensajes entrantes
  async handleIncomingMessage(message) {
    try {
      console.log('📩 Mensaje recibido:', message.body);

      this.receivedMessages.push({
        id: message.id._serialized,
        from: message.from,
        body: message.body,
        timestamp: message.timestamp,
      });

      if (message.isGroup) {
        console.log('🔕 Mensaje de grupo ignorado');
        return;
      }

      this.lastActivity.set(message.from, Date.now()); 
      const userNumber = message.from.split('@')[0];
      const canMessage = await  this.isUserAuthorized(userNumber);
      if (canMessage) {
        if (await this.shouldSendMenu(message.from)) {
          await this.sendMenu(message);
        }
        await this.handleUserResponse(message);
      } else {
        await this.sendUnauthorizedMessage(message);
      }
    } catch (error) {
      console.error('❌ Error procesando mensaje:', error);
    }
  }

  // Detener el cliente de WhatsApp
  async stopBot() {
    this.isConnected = false;
    console.log('🚫 Cliente de WhatsApp detenido');
  }

  // Verificar si el cliente está activo
  async isActive() {
    return this.isConnected;
  }

  // Obtener código QR
  async getQRCode() {
    return this.qrCode;
  }

  // Enviar mensaje
  async sendMessage(numeroDestino, mensaje) {
    if (!numeroDestino || !mensaje) {
      throw new Error('Número de destino y mensaje son requeridos');
    }

    try {
      const chatId = `${numeroDestino}@c.us`;
      return await this.client.sendMessage(chatId, mensaje);
    } catch (error) {
      console.error('❌ Error al enviar mensaje:', error);
      throw error;
    }
  }

  // Obtener mensajes recibidos
  async getReceivedMessages() {
    return this.receivedMessages;
  }

  // Verificar si un usuario está autorizado
  async isUserAuthorized(userNumber) {
    const allowedPhones = await whitePhoneService.getAllPhoneNumbers();
    const normalizedUserNumber = userNumber.toString().replace(/^0+/, ''); // Remove leading zeros
    return allowedPhones.some(phone => phone.toString().replace(/^0+/, '') === normalizedUserNumber); 
  }

  // Determinar si se debe enviar el menú
  async shouldSendMenu(userId) {
    const lastTimestamp = this.lastActivity.get(userId) || 0;
    return Date.now() - lastTimestamp > 300000;
  }

  // Enviar el menú al usuario
  async sendMenu(message) {
    await this.client.sendMessage(
      message.from,
      `*Bienvenido al asistente de Luzara*\n\n` +
      `1️⃣: Sector administrativo.\n` +
      `2️⃣: Salidas estudiantiles.\n` +
      `3️⃣: Salidas grupales.\n\n` +
      `Por favor, responde con el número de la opción que deseas.`
    );
  }

  // Manejar respuesta del usuario
  async handleUserResponse(message) {
    const responses = {
        '1': '✅ Información sobre nuestros servicios: ...',
        '2': async () => {
            let salesMan = await getNextSalesman();
            await this.client.sendMessage(message.from, `‍ Agente: ${salesMan.name}\n ${salesMan.phone}`);
            await this.client.sendMessage(message.from, salesMan.whatsappUrl);
        },
        '3': async () => {
            await this.client.sendMessage(
                message.from,
                `*Menú de Promociones*\n\n` +
                `1️⃣: Salida 1\n` +
                `2️⃣: Salida 2\n` +
                `3️⃣: Salida 3\n\n` +
                `3️⃣: Salida 4\n\n` +
                `3️⃣: Salida 5\n\n` +
                `3️⃣: Volver al menú principal\n\n` +

                `Por favor, responde con el número de la opción que deseas.`
            );
        },
    };

    const response = responses[message.body];
    if (response) {
        if (typeof response === 'function') {
            await response();
        } else {
            await this.client.sendMessage(message.from, response);
        }
    } else {
        // Manejar respuestas específicas dentro del menú de promociones
        if (message.body === '3:1') {
          console.log('1');
        } else if (message.body === '3:2') {
          console.log('2');
        } else {
            await this.sendMenu(message); // Volver al menú principal
        }
    }
}

async sendPromotionDetails(message, promotionId) {
    // Lógica para obtener los detalles de la promoción según el ID
    const promotion = await getPromotionDetails(promotionId); // Suponiendo una función para obtener detalles

    await this.client.sendMessage(message.from, `Detalles de la promoción ${promotionId}:\n${promotion.description}`);
}

  // Enviar mensaje de usuario no autorizado
  async sendUnauthorizedMessage(message) {
    // await this.client.sendMessage(message.from, '⛔ No estás autorizado para usar este servicio.');
  }

  // Enviar imagen
  async sendImage(chatId, itemId) {
    try {
      const menuItem = await MenuItem.findById(itemId);
      const imagePath = menuItem.imagePath;
      const attachment = await MessageMedia.fromFilePath(imagePath);
      await this.client.sendMessage(chatId, attachment);
    } catch (error) {
      console.error('❌ Error al enviar la imagen:', error);
      throw error;
    }
  }
  async sendImageFromUrl(chatId, imageUrl) {
    try {
      const response = await fetch(imageUrl);
      const buffer = await response.buffer();
      const attachment = await MessageMedia.fromBuffer(buffer, 'image/jpeg');
      await this.client.sendMessage(chatId, attachment);
    } catch (error) {
      console.error('❌ Error al enviar la imagen desde URL:', error);
      throw error;
    }
  }
}

module.exports = new WhatsAppWebService();
