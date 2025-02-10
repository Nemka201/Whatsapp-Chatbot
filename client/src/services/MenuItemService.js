import api from './InterceptorService';

const apiPath ='/menu-items/';

const MenuItemService = {

  getAllMenuItems: async () => {
    try {
      const response = await api.get(apiPath);
      return response.data;
    } catch (error) {
      console.error('Error fetching all menu items:', error); 
      throw new Error('Failed to fetch menu items.'); 
    }
  },

  addMenuItem: async (menuItemData) => { 
    try {
      const response = await api.post(apiPath, menuItemData);
      return response.data;
    } catch (error) {
      console.error('Error adding menu item:', error);
      throw new Error('Failed to add menu item.');
    }
  },

  getMenuItemById: async (id) => {
    try {
    const response = await api.get(`${apiPath}${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching menu item by ID:', error);
      throw new Error('Failed to fetch menu item by ID.');
    }
  },

  deleteMenuItem: async (id) => {
    try {
      await api.delete(`${apiPath}${id}`);
    } catch (error) {
      console.error('Error deleting menu item:', error);
      throw new Error('Failed to delete menu item.');
    }
  },

  updateMenuItem: async (id, menuItemData) => {
    try {
      const response = await api.put(`${apiPath}${id}`, menuItemData);
      return response.data;
    } catch (error) {
      console.error('Error updating menu item:', error);
      throw new Error('Failed to update menu item.');
    }
  },
};

export { MenuItemService };