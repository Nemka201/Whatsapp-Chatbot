const mongoose = require('mongoose');

const options = {
  timestamps: true,
};

const menuItemSchema = new mongoose.Schema({
  command: {
    type: Number,
    required: true,
    unique: true
  },
  commandType: {
    type: String,
    enum: ['Text message', 'Menu'],
    default: 'Text message'
  },
  images: [{
    imagePath: { type: String, required: true }, // Ruta o ID de la imagen
    description: String // Descripción opcional de la imagen
  }],
  messageText: String,
  subMenuItems: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' } // Referencia al modelo MenuItem
  ]
}, options);

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

module.exports = MenuItem;