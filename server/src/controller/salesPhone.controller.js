const salesPhone = require('../models/salesPhone.model');

// Get all White Phones
const getAllSalesPhones = async (req, res) => {
  try {
    const items = await salesPhone.find().sort({ command: 1 });
    return res.json(items);
  } catch (err) {
    console.error(err);
    return res.status(400).json(`Error: ${err}`);
  }
};

// Add a new White Phone
const addSalesPhone = async (req, res) => {
  try {
    const number = Number(req.body.number);
    const name = req.body.name;

    const newsalesPhone = new salesPhone({ number, name });
    await newsalesPhone.save();
    return res.json('White phone added!');
  } catch (err) {
    console.error(err);
    return res.status(400).json(`Error: ${err}`);
  }
};

// Get a specific White Phone by ID
const getSalesPhoneById = async (req, res) => {
  try {
    const item = await salesPhone.findById(req.params.id);
    if (!item) return res.status(404).json('Sales phone not found');
    return res.json(item);
  } catch (err) {
    console.error(err);
    return res.status(400).json(`Error: ${err}`);
  }
};

// Delete a White Phone by ID
const deleteSalesPhone = async (req, res) => {
  try {
    await salesPhone.findByIdAndDelete(req.params.id);
    return res.json('Sales phone deleted.');
  } catch (err) {
    console.error(err);
    return res.status(400).json(`Error: ${err}`);
  }
};

// Update a White Phone by ID
const updateSalesPhone = async (req, res) => {
  try {
    const salesPhoneObj = await salesPhone.findById(req.params.id);
    if (!salesPhoneObj) return res.status(404).json('Sales phone not found');

    salesPhoneObj.number = Number(req.body.number);
    salesPhoneObj.name = req.body.name;

    await salesPhoneObj.save();
    return res.json('Sales phone updated!');
  } catch (err) {
    console.error(err);
    return res.status(400).json(`Error: ${err}`);
  }
};

module.exports = {
  getAllSalesPhones,
  addSalesPhone,
  getSalesPhoneById,
  deleteSalesPhone,
  updateSalesPhone,
};