const menuItemService = require('../services/menuItem.service');

// Obtener todos los items del menú
const getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await menuItemService.getAllMenuItems();
    return res.json(menuItems);
  } catch (err) {
    console.error(err);
    return res.status(400).json(`Error: ${err.message}`);
  }
};

// Añadir un nuevo item al menú
const addMenuItem = async (req, res) => {
  try {
    const { command, commandType, messageText } = req.body;

    // Validar los datos
    if (!command || !commandType || !messageText) {
      return res.status(400).json('Command, commandType, and messageText are required');
    }

    const newMenuItem = await menuItemService.addMenuItem(command, commandType, messageText);
    return res.json({ message: 'Menu Item added!', menuItem: newMenuItem });
  } catch (err) {
    console.error(err);
    return res.status(400).json(`Error: ${err.message}`);
  }
};

// Obtener un item del menú por ID
const getMenuItemById = async (req, res) => {
  try {
    const menuItem = await menuItemService.getMenuItemById(req.params.id);
    if (!menuItem) {
      return res.status(404).json('Menu Item not found');
    }
    return res.json(menuItem);
  } catch (err) {
    console.error(err);
    return res.status(400).json(`Error: ${err.message}`);
  }
};

// Eliminar un item del menú por ID
const deleteMenuItem = async (req, res) => {
  try {
    await menuItemService.deleteMenuItem(req.params.id);
    return res.json('Menu Item deleted.');
  } catch (err) {
    console.error(err);
    return res.status(400).json(`Error: ${err.message}`);
  }
};

// Actualizar un item del menú por ID
const updateMenuItem = async (req, res) => {
  try {
    const { command, commandType, messageText } = req.body;
    const updatedMenuItem = await menuItemService.updateMenuItem(req.params.id, command, commandType, messageText);

    if (!updatedMenuItem) {
      return res.status(404).json('Menu Item not found');
    }

    return res.json({ message: 'Menu Item updated!', menuItem: updatedMenuItem });
  } catch (err) {
    console.error(err);
    return res.status(400).json(`Error: ${err.message}`);
  }
};

module.exports = {
  getAllMenuItems,
  addMenuItem,
  getMenuItemById,
  deleteMenuItem,
  updateMenuItem,
};
