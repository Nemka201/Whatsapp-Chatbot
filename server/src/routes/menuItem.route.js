const express = require('express');
const router = express.Router();
const menuItemController = require('./menuItem.controller');

// Get all menu items
router.get('/', menuItemController.getAllMenuItems);

// Add a new menu item
router.post('/add', menuItemController.addMenuItem);

// Get a specific menu item by ID
router.get('/:id', menuItemController.getMenuItemById);

// Delete a menu item by ID
router.delete('/:id', menuItemController.deleteMenuItem);

// Update a menu item by ID
router.post('/update/:id', menuItemController.updateMenuItem);

module.exports = router;