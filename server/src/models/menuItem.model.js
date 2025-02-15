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
    enum: ['Opcion', 'Menu'],
    default: 'Opcion'
  },
  images: [{
    imagePath: { type: String, required: true },
    description: String
  }],
  messageText: String,
  subMenuItems: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' } // Referencia al modelo MenuItem
  ]
}, options);

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

module.exports = MenuItem;