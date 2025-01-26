const whitePhone = require('../models/whitePhone.model');

class WhitePhoneService {
  // Obtener todos los teléfonos blancos
  async getAllWhitePhones() {
    try {
      return await whitePhone.find().sort({ command: 1 });
    } catch (err) {
      console.error(err);
      throw new Error('Error getting white phones');
    }
  }

  // Añadir un nuevo teléfono blanco
  async addWhitePhone(number, name) {
    try {
      const newWhitePhone = new whitePhone({ number, name });
      await newWhitePhone.save();
      return newWhitePhone;
    } catch (err) {
      console.error(err);
      throw new Error('Error adding white phone');
    }
  }

  // Obtener un teléfono blanco por ID
  async getWhitePhoneById(id) {
    try {
      return await whitePhone.findById(id);
    } catch (err) {
      console.error(err);
      throw new Error('Error getting white phone by ID');
    }
  }

  // Eliminar un teléfono blanco por ID
  async deleteWhitePhone(id) {
    try {
      await whitePhone.findByIdAndDelete(id);
    } catch (err) {
      console.error(err);
      throw new Error('Error deleting white phone');
    }
  }

  // Actualizar un teléfono blanco por ID
  async updateWhitePhone(id, number, name) {
    try {
      const whitePhoneObj = await whitePhone.findById(id);
      if (!whitePhoneObj) throw new Error('White phone not found');

      whitePhoneObj.number = Number(number);
      whitePhoneObj.name = name;

      await whitePhoneObj.save();
      return whitePhoneObj;
    } catch (err) {
      console.error(err);
      throw new Error('Error updating white phone');
    }
  }
}

module.exports = new WhitePhoneService();
