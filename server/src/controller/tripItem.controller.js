const tripItemService = require('../services/tripItem.service');
const multer = require("multer");
const CloudinaryService = require('../services/cloudinary.service');
const tripItem = require ('../models/tripItem.model.js');

// Configurar Multer (almacenamiento en memoria para acceder al buffer)
const upload = multer({ storage: multer.memoryStorage() });

// Obtener todos los items del menú
const getAllMenuItems = async (req, res) => {
    try {
        const menuItems = await tripItemService.getAllTripItems();
        return res.json(menuItems);
    } catch (err) {
        console.error('Error al obtener los items:', err);
        return res.status(500).json({ error: 'Error al obtener los items' });
    }
};

// Añadir un nuevo item al menú
const addMenuItem = async (req, res) => {
    try {
        const { messageText, departureDate, returnDate, days, nights, price } = req.body;
        const files = req.files;

        if (!messageText || !departureDate || !returnDate || !days || !nights || !price) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        let images = [];
        if (files && files.length > 0) {
            for (const file of files) {
                const result = await CloudinaryService.uploadImage(file.buffer);
                images.push({
                    imagePath: result.secure_url,
                    public_id: result.public_id
                });
            }
        }
        const newTripItem = await tripItemService.addTripItem(
            messageText, departureDate, returnDate, days, nights, price, images
        );

        return res.status(201).json(newTripItem);
    } catch (error) {
        console.error('Error al agregar el viaje:', error);
        return res.status(500).json({ error: 'Error al agregar el viaje' });
    }
};


// Obtener un item del menú por ID
const getMenuItemById = async (req, res) => {
    try {
        const menuItem = await tripItemService.getTripItemById(req.params.id);
        if (!menuItem) {
            return res.status(404).json({ error: 'Item no encontrado' });
        }
        return res.json(menuItem);
    } catch (err) {
        console.error('Error al obtener el item:', err);
        return res.status(500).json({ error: 'Error al obtener el item' });
    }
};

// Eliminar un item del menú por ID
const deleteMenuItem = async (req, res) => {
    try {
        const tripItem = await tripItemService.getTripItemById(req.params.id);

        if (!tripItem) {
            return res.status(404).json({ error: 'Item no encontrado' });
        }

        if (tripItem.images && tripItem.images.length > 0) {
            for (const image of tripItem.images) {
                await CloudinaryService.deleteImage(image.public_id);
            }
        }

        await tripItemService.deleteTripItem(req.params.id);
        return res.json({ message: 'Item eliminado correctamente' });
    } catch (err) {
        console.error('Error al eliminar el item:', err);
        return res.status(500).json({ error: 'Error al eliminar el item' });
    }
};

// Actualizar un item del menú por ID
const updateMenuItem = async (req, res) => {
    try {
        console.log('req.body:', req.body);
        console.log('req.files:', req.files);
        
        const { messageText, departureDate, returnDate, days, nights, price } = req.body;
        const files = req.files;

        // Validar los datos
        if (!messageText || !departureDate || !returnDate || !days || !nights || !price) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        let images = [];

        if (files && files.length > 0) {
            const tripItem = await tripItemService.getTripItemById(req.params.id);
            if (tripItem && tripItem.images) {
                for (const image of tripItem.images) {
                    await CloudinaryService.deleteImage(image.public_id);
                }
            }

            for (const file of files) {
                const result = await CloudinaryService.uploadImage(file.buffer);
                images.push({ imagePath: result.secure_url, public_id: result.public_id });
            }
        }

        const updatedMenuItem = await tripItemService.updateTripItem(
            req.params.id, messageText, departureDate, returnDate, days, nights, price, images
        );

        if (!updatedMenuItem) {
            return res.status(404).json({ error: 'Item no encontrado' });
        }

        return res.json({ message: 'Item actualizado correctamente', menuItem: updatedMenuItem });
    } catch (err) {
        console.error('Error al actualizar el item:', err);
        return res.status(500).json({ error: 'Error al actualizar el item' });
    }
};

module.exports = {
    getAllMenuItems,
    addMenuItem,
    getMenuItemById,
    deleteMenuItem,
    updateMenuItem,
};
