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
router.get('/sales-phones', getAllSalesPhones);

// Add a new sales Phone
router.post('/sales-phones', addSalesPhone);

// Get a specific sales Phone by ID
router.get('/sales-phones/:id', getSalesPhoneById);

// Delete a sales Phone by ID
router.delete('/sales-phones/:id', deleteSalesPhone);

// Update a sales Phone by ID
router.put('/sales-phones/:id', updateSalesPhone);

module.exports = router;