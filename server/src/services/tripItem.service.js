const TripItem = require('../models/tripItem.model');
const CloudinaryService = require('../services/cloudinary.service');
const multer = require("multer");

class TripItemService {
    // Obtener todos los items del menú
    async getAllTripItems() {
        try {
            return await TripItem.find().sort({ departureDate: 1 }); // Ordenar por fecha de salida
        } catch (err) {
            console.error(err);
            throw new Error('Error getting menu items');
        }
    }

    // Añadir un nuevo item al menú
    async addTripItem(messageText, departureDate, returnDate, days, nights, price, images) {
        try {
            const newTripItem = new TripItem({
                messageText,
                departureDate,
                returnDate,
                days,
                nights,
                price,
                images,
            });

            await newTripItem.save();
            return newTripItem;
        } catch (err) {
            console.error(err);
            console.error("TripItemService.js: Error al guardar:", err); // Imprime el error
            throw new Error('Error adding menu item');
            }
    }

    // Obtener un item del menú por ID
    async getTripItemById(id) {
        try {
            return await TripItem.findById(id);
        } catch (err) {
            console.error(err);
            throw new Error('Error getting menu item by ID');
        }
    }

    // Eliminar un item del menú por ID
    async deleteTripItem(id) {
        try {
            await TripItem.findByIdAndDelete(id);
        } catch (err) {
            console.error(err);
            throw new Error('Error deleting menu item');
        }
    }

    // Actualizar un item del menú por ID
    async updateTripItem(id, messageText, departureDate, returnDate, days, nights, price, images) {
        try {
            const tripItem = await TripItem.findById(id);
            if (!tripItem) throw new Error('Menu item not found');

            tripItem.messageText = messageText;
            tripItem.departureDate = departureDate;
            tripItem.returnDate = returnDate;
            tripItem.days = days;
            tripItem.nights = nights;
            tripItem.price = price;
            if(images) tripItem.images = images;

            await tripItem.save();
            return tripItem;
        } catch (err) {
            console.error(err);
            throw new Error('Error updating menu item');
        }
    }
}

module.exports = new TripItemService();