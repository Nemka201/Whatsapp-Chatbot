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
    this.receivedMessages = []; // Array to store received messages
  }

  // Inicializa el cliente y genera el código QR
  initializeClient() {
    this.client.on('qr', qr => {
      qrcode.generate(qr, { small: true });
    });

    this.client.on('ready', () => {
      console.log('Client is ready!');
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

      // Lógica de navegación del menú
      if (!message.isGroup) {
        let currentMenu = menu;
        const partes = message.body.toLowerCase().split(' ');

        partes.forEach(parte => {
          currentMenu = currentMenu[parte];
          if (!currentMenu) {
            message.reply('Opción no válida.');
            return;
          }
        });

        if (typeof currentMenu === 'object') {
          message.reply(this.generarRespuesta(currentMenu));
        } else {
          message.reply(`Has seleccionado: ${currentMenu}`);
        }
      } else {
        console.log('Mensaje de grupo ignorado');
      }
    });

    this.client.initialize();
  }

  // Función para generar respuesta en base a las opciones del menú
  generarRespuesta(opciones) {
    let respuesta = 'Selecciona una opción:\n';
    let i = 1;
    for (const opcion in opciones) {
      respuesta += `${i}. ${opcion}\n`;
      i++;
    }
    return respuesta;
  }

  // Función para enviar un mensaje
  async sendMessage(numeroDestino, mensaje) {
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

  // Retornar los mensajes recibidos
  getReceivedMessages() {
    return this.receivedMessages;
  }
}

module.exports = new WhatsAppWebService();
