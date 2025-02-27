import api from './InterceptorService';

const apiPath = 'trip-items/';

const TripItemService = {
    getAllMenuItems: async () => {
        try {
            const response = await api.get(apiPath);
            return response.data;
        } catch (error) {
            console.error('Error fetching all trip items:', error);
            throw new Error('Failed to fetch trip items.');
        }
    },

    addMenuItem: async (menuItemData) => {
        try {
            const response = await api.post(apiPath, menuItemData);
            return response.data;
        } catch (error) {
            console.error('Error adding trip item:', error);
            throw new Error('Failed to add trip item.');
        }
    },

    getMenuItemById: async (id) => {
        try {
            const response = await api.get(`${apiPath}${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching trip item by ID:', error);
            throw new Error('Failed to fetch trip item by ID.');
        }
    },

    deleteMenuItem: async (id) => {
        try {
            await api.delete(`${apiPath}${id}`);
        } catch (error) {
            console.error('Error deleting trip item:', error);
            throw new Error('Failed to delete trip item.');
        }
    },

    updateMenuItem: async (id, menuItemData) => {
        try {
            const response = await api.put(`${apiPath}${id}`, menuItemData);
            return response.data;
        } catch (error) {
            console.error('Error updating trip item:', error);
            throw new Error('Failed to update trip item.');
        }
    },
};

export { TripItemService };