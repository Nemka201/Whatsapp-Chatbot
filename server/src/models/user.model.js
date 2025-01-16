const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nombreCompleto: {
    type: String,
    required: true
  },
  numeroTelefono: {
    type: String,
    required: true,
    unique: true
  },
  usuario: {
    type: String,
    required: true,
    unique: true
  },
  contrasena: {
    type: String,
    required: true
  },
  fechaAlta: {
    type: Date,
    default: Date.now
  },
  ingresos: [{
    monto: Number,
    fecha: Date
  }]
});

module.exports = mongoose.model('User', userSchema);