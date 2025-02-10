const SalesPhoneService = require('../services/salesPhone.service');

// Crear una cola global como un array
let salesmanQueue = [];

async function getNextSalesman() {
  try {
    // Verificar si la cola está vacía
    if (salesmanQueue.length === 0) {
      const salesmen = await SalesPhoneService.getAllSalesPhones(); // Obtener los vendedores desde la base de datos

      if (!salesmen || salesmen.length === 0) {
        console.log('No hay vendedores disponibles en la base de datos.');
        return null; // Si no hay vendedores, retornar null
      }

      console.log('Vendedores cargados:', salesmen);

      // Rellenar la cola con los vendedores
      salesmanQueue = [...salesmen];
    }

    // Obtener el siguiente vendedor de la cola
    const nextSalesman = salesmanQueue.shift(); // Extraer y eliminar el primer vendedor de la cola

    // Si la cola queda vacía, volver a llenarla con los mismos vendedores
    if (salesmanQueue.length === 0) {
      const salesmen = await SalesPhoneService.getAllSalesPhones();
      salesmanQueue = [...salesmen];
    }

    console.log('Vendedor asignado:', nextSalesman);
    return nextSalesman; // Retornar el vendedor seleccionado
  } catch (error) {
    console.error('Error al obtener el siguiente vendedor:', error);
    throw error;
  }
}

module.exports = {
  getNextSalesman,
};
