const mongoose = require('mongoose');

const tripItemSchema = new mongoose.Schema({
    messageText: { type: String, required: true },
    departureDate: { type: Date, required: true },
    returnDate: { type: Date, required: true },
    days: { type: Number, required: true },
    nights: { type: Number, required: true },
    price: { type: Number, required: true },
    images: [{
        imagePath: { type: String, required: true },
        public_id: { type: String, required: true }
    }]
});

module.exports = mongoose.model('TripItem', tripItemSchema);