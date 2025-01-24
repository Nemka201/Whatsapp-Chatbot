const async = require('async'); // No uses destructuring para evitar confusión
const SalesPhoneService = require('../services/salesPhone.service');

async function getNextNumber() {
  // Crear la cola
  let phoneQueue = async.queue(async (task, callback) => {
    callback(); // La cola ejecutará tareas en este formato, aunque aquí no lo necesitas
  });

  while (true) {
    try {
      if (phoneQueue.length() === 0) {
        const phones = await SalesPhoneService.getAllSalesPhones(); // Obtener los teléfonos desde la base de datos
        phones.forEach(phone => phoneQueue.push(phone.numero)); // Agregar los números a la cola
      }

      const numero = phoneQueue.workersList()[0]; // Obtener el siguiente número
      phoneQueue.remove(phoneQueue.workersList()[0]); // Eliminarlo de la cola después de usarlo
      return numero;
    } catch (error) {
      console.error('Error al obtener el siguiente número:', error);
      throw error;
    }
  }
}

module.exports = {
  getNextNumber,
};
