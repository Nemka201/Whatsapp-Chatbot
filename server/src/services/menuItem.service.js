const MenuItem = require('../models/menuItem.model');

class MenuItemService {
  // Obtener todos los items del menú
  async getAllMenuItems() {
    try {
      return await MenuItem.find().sort({ command: 1 });
    } catch (err) {
      console.error(err);
      throw new Error('Error getting menu items');
    }
  }

  // Añadir un nuevo item al menú
  async addMenuItem(command, commandType, messageText) {
    try {
      const newMenuItem = new MenuItem({
        command,
        commandType,
        messageText,
      });

      await newMenuItem.save();
      return newMenuItem;
    } catch (err) {
      console.error(err);
      throw new Error('Error adding menu item');
    }
  }

  // Obtener un item del menú por ID
  async getMenuItemById(id) {
    try {
      return await MenuItem.findById(id);
    } catch (err) {
      console.error(err);
      throw new Error('Error getting menu item by ID');
    }
  }

  // Eliminar un item del menú por ID
  async deleteMenuItem(id) {
    try {
      await MenuItem.findByIdAndDelete(id);
    } catch (err) {
      console.error(err);
      throw new Error('Error deleting menu item');
    }
  }

  // Actualizar un item del menú por ID
  async updateMenuItem(id, command, commandType, messageText) {
    try {
      const menuItem = await MenuItem.findById(id);
      if (!menuItem) throw new Error('Menu item not found');

      menuItem.command = Number(command);
      menuItem.commandType = commandType;
      menuItem.messageText = messageText;

      await menuItem.save();
      return menuItem;
    } catch (err) {
      console.error(err);
      throw new Error('Error updating menu item');
    }
  }

  // Obtener menu root
  async getMenuString() {
    try {
      const rootMenuItems = await MenuItem.find({ parentMenu: null }).sort({ command: 1 }); 
      let menuString = '*Menú Principal*\n\n';

      for (const item of rootMenuItems) {
        menuString += `${item.command}️⃣: ${item.messageText}\n`;
      }

      menuString += '\nPor favor, responde con el número de la opción que deseas.';

      return menuString;
    } catch (err) {
      console.error(err);
      throw new Error('Error generating menu string');
    }
  }

  // Obtener opciones del menu
  async getSubMenuOptions(parentId) {
    try {
      const subMenuItems = await MenuItem.find({ parentMenu: parentId }).sort({ command: 1 });
      let menuString = '';
  
      if (subMenuItems.length === 0) {
        return 'No hay subopciones para este menú.';
      }
  
      for (const item of subMenuItems) {
        menuString += `${item.command}️⃣: ${item.messageText}\n`;
      }
  
      return menuString;
    } catch (err) {
      console.error(err);
      throw new Error('Error getting sub menu options');
    }
  }
}

module.exports = new MenuItemService();
