const whitePhone = require('../models/whitePhone.model');

// Get all White Phones
const getAllWhitePhones = async (req, res) => {
  try {
    const items = await whitePhone.find().sort({ command: 1 });
    return res.json(items);
  } catch (err) {
    console.error(err);
    return res.status(400).json(`Error: ${err}`);
  }
};

// Add a new White Phone
const addWhitePhone = async (req, res) => {
  try {
    const number = Number(req.body.number);
    const name = req.body.name;

    const newWhitePhone = new whitePhone({ number, name });
    await newWhitePhone.save();
    return res.json('White phone added!');
  } catch (err) {
    console.error(err);
    return res.status(400).json(`Error: ${err}`);
  }
};

// Get a specific White Phone by ID
const getWhitePhoneById = async (req, res) => {
  try {
    const item = await whitePhone.findById(req.params.id);
    if (!item) return res.status(404).json('White phone not found');
    return res.json(item);
  } catch (err) {
    console.error(err);
    return res.status(400).json(`Error: ${err}`);
  }
};

// Delete a White Phone by ID
const deleteWhitePhone = async (req, res) => {
  try {
    await whitePhone.findByIdAndDelete(req.params.id);
    return res.json('White phone deleted.');
  } catch (err) {
    console.error(err);
    return res.status(400).json(`Error: ${err}`);
  }
};

// Update a White Phone by ID
const updateWhitePhone = async (req, res) => {
  try {
    const whitePhoneObj = await whitePhone.findById(req.params.id);
    if (!whitePhoneObj) return res.status(404).json('White phone not found');

    whitePhoneObj.number = Number(req.body.number);
    whitePhoneObj.name = req.body.name;

    await whitePhoneObj.save();
    return res.json('White phone updated!');
  } catch (err) {
    console.error(err);
    return res.status(400).json(`Error: ${err}`);
  }
};

module.exports = {
  getAllWhitePhones,
  addWhitePhone,
  getWhitePhoneById,
  deleteWhitePhone,
  updateWhitePhone,
};