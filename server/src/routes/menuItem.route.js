const express = require('express');
const router = express.Router();
const menuItemController = require('../controller/menuItem.controller');

// Get all menu items
router.get('/', menuItemController.getAllMenuItems);

// Add a new menu item
router.post('/', menuItemController.addMenuItem);

// Get a specific menu item by ID
router.get('/:id', menuItemController.getMenuItemById);

// Delete a menu item by ID
router.delete('/:id', menuItemController.deleteMenuItem);

// Update a menu item by ID
router.put('/:id', menuItemController.updateMenuItem);

module.exports = router;