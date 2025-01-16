const api = require('./InterceptorService'); 

// Get all menu items
const getAllMenuItems = async () => {
    try {
      const response = await api.get('/menuItems');
      return response.data;
    } catch (error) {
      console.error('Error getting all menu items:', error);
      throw error;
    }
  };
  
  // Add a new menu item
  const addMenuItem = async (command, commandType, messageText) => {
    try {
      const response = await api.post('/menuItems', { command, commandType, messageText });
      return response.data;
    } catch (error) {
      console.error('Error adding menu item:', error);
      throw error;
    }
  };
    
  // Get a specific menu item by ID
  const getMenuItemById = async (id) => {
    try {
      const response = await api.get(`/menuItems/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error getting menu item by ID:', error);
      throw error;
    }
  };
  
  // Delete a menu item by ID
  const deleteMenuItem = async (id) => {
    try {
      await api.delete(`/menuItems/${id}`);
    } catch (error) {
      console.error('Error deleting menu item:', error);
      throw error;
    }
  };
  
  // Update a menu item by ID
  const updateMenuItem = async (id, command, commandType, messageText) => {
    try {
      const response = await api.put(`/menuItems/${id}`, { command, commandType, messageText });
      return response.data;
    } catch (error) {
      console.error('Error updating menu item:', error);
      throw error;
    }
  };
  
  export { getAllMenuItems, addMenuItem, getMenuItemById, deleteMenuItem, updateMenuItem };