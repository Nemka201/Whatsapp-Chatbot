import api from './InterceptorService';
import { uploadImageToCloudinary } from './CloudinaryService';

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
      const uploadedImageUrls = await Promise.all(
        menuItemData.images.map(async (image) => {
          try {
            const imageUrl = await CloudinaryService.uploadImage(image);
            return imageUrl;
          } catch (error) {
            console.error('Error al subir la imagen:', error);
            return null; 
          }
        })
      );

      // Filtrar las URLs válidas
      const validImageUrls = uploadedImageUrls.filter(url => url !== null);

      // Actualizar menuItemData con las URLs válidas
      const updatedMenuItemData = {
        ...menuItemData,
        images: validImageUrls.map(url => ({ imagePath: url }))
      };

      const response = await api.post(apiPath, updatedMenuItemData); 
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
      // Eliminar imágenes anteriores si existen
      const existingMenuItem = await MenuItemService.getMenuItemById(id); 
      if (existingMenuItem && existingMenuItem.images) {
        await Promise.all(
          existingMenuItem.images.map(async (image) => {
            try {
              await CloudinaryService.deleteImage(image.imagePath); 
            } catch (error) {
              console.error('Error al eliminar la imagen:', error);
            }
          })
        );
      }

      // Subir nuevas imágenes a Cloudinary
      const uploadedImageUrls = await Promise.all(
        menuItemData.images.map(async (image) => {
          try {
            const imageUrl = await CloudinaryService.uploadImage(image);
            return imageUrl;
          } catch (error) {
            console.error('Error al subir la imagen:', error);
            return null;
          }
        })
      );

      // Filtrar las URLs válidas
      const validImageUrls = uploadedImageUrls.filter(url => url !== null);

      // Actualizar menuItemData con las URLs válidas
      const updatedMenuItemData = {
        ...menuItemData,
        images: validImageUrls.map(url => ({ imagePath: url }))
      };

      const response = await api.put(`${apiPath}${id}`, updatedMenuItemData);
      return response.data;
    } catch (error) {
      console.error('Error updating menu item:', error);
      throw new Error('Failed to update menu item.');
    }
  },
};

export { MenuItemService };