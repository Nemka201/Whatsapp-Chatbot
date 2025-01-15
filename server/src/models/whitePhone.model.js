const mongoose = require('mongoose');

const whitePhoneSchema = mongoose.Schema({
  phone: { 
    type: Number, 
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
}, 
{
  timestamps: true,
});

const whitePhone = mongoose.model('whitePhone', whitePhoneSchema);

module.exports = whitePhone;