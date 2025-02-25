const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode64 = require('qrcode');
const fs = require('fs');
const whitePhoneService = require('../services/whitePhone.service');
const menuItemService = require('../services/menuItem.service');
const tripItemService = require('../services/tripItem.service');
const { getNextSalesman } = require('../utilities/getSalesman');
const axios = require('axios');

class WhatsAppWebService {
  constructor() {
    const path = '/whatsapp-session';

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
    this.userStates = new Map();
    this.isConnected = false;
    this.receivedMessages = [];
    this.activeTripsMenus = new Map();

    if (fs.existsSync(path)) {
      console.log('✅ Carpeta de sesión encontrada');
    } else {
      console.error('❌ La carpeta de sesión no encontrada, inicializando cliente');
    }
    this.initializeClient();
  }

  // Inicializar el cliente
  async initialize() {
    const path = '/whatsapp-session';

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

    if (fs.existsSync(path)) {
      console.log('✅ Carpeta de sesión encontrada');
    } else {
      console.error('❌ La carpeta de sesión no encontrada, inicializando cliente');
    }
    this.initializeClient();
  }

  async initializeClient() {
    this.client.on('qr', (qr) => {
      qrcode64.toDataURL(qr, { errorCorrectionLevel: 'H' }, (err, url) => {
        if (err) {
          console.error('Error generando QR:', err);
          return;
        }
        this.qrCode = url;
      });
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
      const canMessage = await this.isUserAuthorized(userNumber);
      if (canMessage) {
        await this.routeUser(message);
      } else {
        await this.sendUnauthorizedMessage(message);
      }
    } catch (error) {
      console.error('❌ Error procesando mensaje:', error);
    }
  }

  // Manejar navegación según el estado del usuario
  async routeUser(message) {
    const userState = this.userStates.get(message.from) || 'MAIN_MENU';

    if (userState === 'GROUP_TRIPS_MENU') {
      await this.handleGroupTripsSubMenu(message);
    } else {
      await this.handleUserResponse(message);
    }
  }

  // Manejar la respuesta del usuario
  async handleUserResponse(message) {
    const userResponse = message.body.trim();
    const adminUrl = "";
    const estudiantilUrl = "";
    switch (userResponse) {
      case '1':
        await this.client.sendMessage(message.from, '📂 Sector Administrativo. Toca en enlace para ser atendido');
        await this.client.sendMessage(message.from, adminUrl);
        break;
      case '2':
        await this.client.sendMessage(message.from, '📚 Salidas Estudiantiles. Toca en enlace para ser atendido');
        await this.client.sendMessage(message.from, estudiantilUrl);
        break;
      case '3':
        this.userStates.set(message.from, 'GROUP_TRIPS_MENU');
        await this.handleGroupTripsSubMenu(message);
        break;
      default:
        // await this.client.sendMessage(message.from, '⚠️ Opción no válida. Por favor, selecciona una opción del menú.');
        await this.sendMenu(message);
    }
  }

  // Detener el cliente de WhatsApp
  async stopBot() {
    this.client.on('disconnected', () => {
      console.log('⚠️ Cliente de WhatsApp desconectado');
      this.isConnected = false;
      this.qrCode = null;
    });
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

  // Verificar si un usuario está autorizado
  async isUserAuthorized(userNumber) {
    const allowedPhones = await whitePhoneService.getAllPhoneNumbers();
    const normalizedUserNumber = userNumber.toString().replace(/^0+/, '');
    return allowedPhones.some(phone => phone.toString().replace(/^0+/, '') === normalizedUserNumber);
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

  // Enviar imagen de menuItem
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

  // Enviar imagen por URL
  async sendImageFromUrl(chatId, imageUrl) {
    try {
      console.log("📤 Enviando imagen desde URL:", imageUrl);

      // Obtener la imagen como buffer
      const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

      if (response.status !== 200) {
        console.error(`Error al obtener la imagen: ${response.status} ${response.statusText}`);
        return; // Salir si la respuesta no es exitosa
      }

      const buffer = Buffer.from(response.data, 'binary');

      // Detectar el tipo de imagen
      const mimeType = imageUrl.endsWith('.png') ? 'image/png' : 'image/jpeg';

      // Crear objeto MessageMedia
      const attachment = new MessageMedia(mimeType, buffer.toString('base64'));

      // Enviar la imagen
      await this.client.sendMessage(chatId, attachment);
      console.log("✅ Imagen enviada correctamente.");
    } catch (error) {
      console.error('❌ Error al enviar la imagen desde URL:', error);
      console.log(error); // Mostrar el error completo
      throw error;
    }
  }


  // Enviar mensaje de usuario no autorizado
  async sendUnauthorizedMessage(message) {
    // await this.client.sendMessage(message.from, '⛔ No estás autorizado para usar este servicio.');
  }

  // Enviar menu de salidas grupales
  async sendGroupTripsMenu(message) {
    const trips = await tripItemService.getAllTripItems();
    if (!trips || trips.length === 0) {
      await this.client.sendMessage(message.from, '⚠️ No hay opciones disponibles.');
      return {};
    }

    let menuText = '*Menú de Salidas Grupales*\n\n';
    let options = {};

    trips.forEach((trip, index) => {
      const departure = trip.departureDate.toLocaleDateString('es-ES');
      const returnDate = trip.returnDate.toLocaleDateString('es-ES');
      menuText += `${index + 1}️⃣: ${trip.messageText}\n`;
      // menuText += `   Salida: ${departure} - Vuelta: ${returnDate}\n`;
      // menuText += `   ⏳ ${trip.days} días / ${trip.nights} noches\n`;
      // menuText += `    Precio: ${trip.price} $\n\n`;
      options[(index + 1).toString()] = trip;
    });

    menuText += '0️⃣: Volver al menú principal\n\nResponde con el número de la opción.';
    await this.client.sendMessage(message.from, menuText);
    return options;
  }

  // Manejar menu de viajes
  async handleGroupTripsSubMenu(message) {
    const trips = this.activeTripsMenus.get(message.from) || {};

    const response = message.body.trim();
    if (response === '0') {
      this.userStates.set(message.from, 'MAIN_MENU');
      this.activeTripsMenus.delete(message.from);
      await this.sendMenu(message);
      return;
    }

    const trip = trips[response];
    if (trip) {
      // const tripDetails = `*${trip.messageText}*\n\nSalida: ${trip.departureDate.toLocaleDateString('es-ES')} - Vuelta: ${trip.returnDate.toLocaleDateString('es-ES')}\n⏳ ${trip.days} días / ${trip.nights} noches\nPrecio: ${trip.price} $`;
      // await this.client.sendMessage(message.from, tripDetails);

      // Enviar imágenes
      if (trip.images && trip.images.length > 0) {
        for (const img of trip.images) {
          if (img.imagePath) {
            await this.sendImageFromUrl(message.from, img.imagePath);
          } else {
            console.warn('❌ img.imagePath no definido para una imagen');
          }
        }
      }
      const infoVendedor = await getNextSalesman();

      if (infoVendedor) {
        await this.client.sendMessage(
          message.from,
          `Para más consultas puedes contactarte con ${infoVendedor.name} tocando el siguiente enlace.`
        );
        await this.client.sendMessage(message.from, infoVendedor.whastappUrl);
      } else {
        await this.client.sendMessage(message.from, '⚠️ No hay vendedores disponibles en este momento.');
      }


    } else {
      this.activeTripsMenus.set(message.from, await this.sendGroupTripsMenu(message));
    }
  }
}

module.exports = new WhatsAppWebService();
