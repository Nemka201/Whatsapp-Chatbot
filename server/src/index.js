// app.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();
const port = process.env.EXPRESS_PORT || 3000;
const db = require('./config/database');

// Importar rutas
const whatsappRoutes = require('./routes/wa');
const salesPhonesRoutes = require ('./routes/salesPhone.route');

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Usar rutas
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/salesman', salesPhonesRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});