const mongoose = require('mongoose');

const salesPhoneSchema = mongoose.Schema({
    phone: { 
        type: Number, 
        required: true,
        unique: true
      },
      name: {
        type: String,
        required: true
      },
}, {
  timestamps: true,
});

const salesPhone = mongoose.model('salesPhone', salesPhoneSchema);

module.exports = salesPhone;