const whitePhoneService = require('../services/whitePhone.service');

// Obtener todos los teléfonos blancos
const getAllWhitePhones = async (req, res) => {
  try {
    const items = await whitePhoneService.getAllWhitePhones();
    return res.json(items);
  } catch (err) {
    console.error(err);
    return res.status(400).json(`Error: ${err.message}`);
  }
};

// Añadir un nuevo teléfono blanco
const addWhitePhone = async (req, res) => {
  try {
    const { number, name } = req.body;

    // Validar los datos
    if (!number || !name) {
      return res.status(400).json('Number and name are required');
    }

    const newWhitePhone = await whitePhoneService.addWhitePhone(number, name);
    return res.json({ message: 'White phone added!', whitePhone: newWhitePhone });
  } catch (err) {
    console.error(err);
    return res.status(400).json(`Error: ${err.message}`);
  }
};

// Obtener un teléfono blanco por ID
const getWhitePhoneById = async (req, res) => {
  try {
    const item = await whitePhoneService.getWhitePhoneById(req.params.id);
    if (!item) {
      return res.status(404).json('White phone not found');
    }
    return res.json(item);
  } catch (err) {
    console.error(err);
    return res.status(400).json(`Error: ${err.message}`);
  }
};

// Eliminar un teléfono blanco por ID
const deleteWhitePhone = async (req, res) => {
  try {
    await whitePhoneService.deleteWhitePhone(req.params.id);
    return res.json('White phone deleted.');
  } catch (err) {
    console.error(err);
    return res.status(400).json(`Error: ${err.message}`);
  }
};

// Actualizar un teléfono blanco por ID
const updateWhitePhone = async (req, res) => {
  try {
    const { phone, name } = req.body;
    const fieldsToUpdate = Object.entries({ name, phone });
    const updatedWhitePhone = await whitePhoneService.updateWhitePhone(req.params.id, ...fieldsToUpdate);
    if (!updatedWhitePhone) {
      return res.status(404).json({ message: 'White phone not found' });
    }
    return res.json(updatedWhitePhone);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: 'Error updating White phone' });
  }
};

module.exports = {
  getAllWhitePhones,
  addWhitePhone,
  getWhitePhoneById,
  deleteWhitePhone,
  updateWhitePhone,
};
