const express = require('express');
const router = express.Router();

const {
  getAllWhitePhones,
  addWhitePhone,
  getWhitePhoneById,
  deleteWhitePhone,
  updateWhitePhone,
} = require('../controller/whitePhone.controller');

// Get all White Phones
router.get('/white-phones', getAllWhitePhones);

// Add a new White Phone
router.post('/white-phones', addWhitePhone);

// Get a specific White Phone by ID
router.get('/white-phones/:id', getWhitePhoneById);

// Delete a White Phone by ID
router.delete('/white-phones/:id', deleteWhitePhone);

// Update a White Phone by ID
router.put('/white-phones/:id', updateWhitePhone);

module.exports = router;