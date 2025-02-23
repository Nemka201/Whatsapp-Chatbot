const express = require('express');
const router = express.Router();
const tripItemController = require('../controller/tripItem.controller');
const multer = require("multer");

const upload = multer(); // Inicializar multer

// Get all menu items
router.get('/', tripItemController.getAllMenuItems);

// Add a new menu item
router.post('/', upload.array('images'), tripItemController.addMenuItem);

// Get a specific menu item by ID
router.get('/:id', tripItemController.getMenuItemById);

// Delete a menu item by ID
router.delete('/:id', tripItemController.deleteMenuItem);

// Update a menu item by ID
router.put('/:id', upload.array('images'), tripItemController.updateMenuItem);

module.exports = router;