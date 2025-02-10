const express = require('express');
const router = express.Router();

const {
  getAllSalesPhones,
  addSalesPhone,
  getSalesPhoneById,
  deleteSalesPhone,
  updateSalesPhone,
} = require('../controller/salesPhone.controller');

// Get all sales Phones
router.get('', getAllSalesPhones);

// Add a new sales Phone
router.post('', addSalesPhone);

// Get a specific sales Phone by ID
router.get('/:id', getSalesPhoneById);

// Delete a sales Phone by ID
router.delete('/:id', deleteSalesPhone);

// Update a sales Phone by ID
router.put('/:id', updateSalesPhone);

module.exports = router;