const whitePhone = require('../models/whitePhone.model');

class WhitePhoneService {
  // Obtener todos los registors blancos
  async getAllWhitePhones() {
    try {
      return await whitePhone.find().sort({ command: 1 });
    } catch (error) {
      console.error(error);
      throw new Error('Error getting white phones');
    }
  }
  // Obtener numeros de telefonos unicamente
  async getAllPhoneNumbers() {
  try {
    const whitePhones = await whitePhone.find();
    const phoneNumbers = whitePhones.map(phone => phone.phone);
    return phoneNumbers;
  } catch (error) {
    console.error('Error al obtener los números de teléfono:', error);
    throw error;
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
  async updateWhitePhone(id, ...fieldsToUpdate) {
    try {
      const whitePhoneObj = await whitePhone.findById(id);
      if (!whitePhoneObj) {
        throw new Error('White phone not found');
      }
      const updateData = {};
      fieldsToUpdate.forEach(([key, value]) => {
        if (value !== undefined) {
          updateData[key] = value;
        }
      });
      if (Object.keys(updateData).length > 0) {
        await whitePhoneObj.updateOne(updateData);
      }
  
      await whitePhoneObj.save();
      return whitePhoneObj;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}

module.exports = new WhitePhoneService();
