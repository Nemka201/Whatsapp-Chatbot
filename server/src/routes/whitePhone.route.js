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
router.get('', getAllWhitePhones);

// Add a new White Phone
router.post('', addWhitePhone);

// Get a specific White Phone by ID
router.get('/:id', getWhitePhoneById);

// Delete a White Phone by ID
router.delete('/:id', deleteWhitePhone);

// Update a White Phone by ID
router.put('/:id', updateWhitePhone);

module.exports = router;