const SalesPhoneService = require('../services/salesPhone.service');

// Get all sales phones
const getAllSalesPhones = async (req, res) => {
  try {
    const salesPhones = await SalesPhoneService.getAllSalesPhones();
    return res.json(salesPhones);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error getting sales phones' });
  }
};

// Add a new sales phone
const addSalesPhone = async (req, res) => {
  try {
    console.log('Datos recibidos:', req.body); // Verifica los datos que llegan
    const { phone, name, whatsappUrl } = req.body;
    const newSalesPhone = await SalesPhoneService.addSalesPhone(phone, name, whatsappUrl);
    return res.json(newSalesPhone);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: 'Error adding sales phone' }); 
  }
};

// Get a specific sales phone by ID
const getSalesPhoneById = async (req, res) => {
  try {
    const salesPhone = await SalesPhoneService.getSalesPhoneById(req.params.id);
    if (!salesPhone) {
      return res.status(404).json({ message: 'Sales phone not found' });
    }
    return res.json(salesPhone);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error getting sales phone' });
  }
};

// Delete a sales phone by ID
const deleteSalesPhone = async (req, res) => {
  try {
    await SalesPhoneService.deleteSalesPhone(req.params.id);
    return res.json({ message: 'Sales phone deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error deleting sales phone' });
  }
};

// Update a sales phone by ID
const updateSalesPhone = async (req, res) => {
  try {
    const { phone, name, whatsappUrl } = req.body;
    const updatedSalesPhone = await SalesPhoneService.updateSalesPhone(
      req.params.id,
      phone,
      name,
      whatsappUrl
    );
    if (!updatedSalesPhone) {
      return res.status(404).json({ message: 'Sales phone not found' });
    }
    return res.json(updatedSalesPhone);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: 'Error updating sales phone' });
  }
};

module.exports = {
  getAllSalesPhones,
  addSalesPhone,
  getSalesPhoneById,
  deleteSalesPhone,
  updateSalesPhone,
};