// app.js
const express = require('express');
const app = express();
require('dotenv').config();

const port = process.env.EXPRESS_PORT || 3000;
const db = require('./config/database');

// Import Middlewares
const cors = require('cors');
const bodyParser = require('body-parser');

// Import routes
// const whatsappRoutes = require('./routes/wa');
const salesPhonesRoutes = require('./routes/salesPhone.route');
const userRoutes = require('./routes/user.route');
const menuItemRoutes = require('./routes/menuItem.route');
const tripItemRoutes = require('./routes/tripItem.route');
const whitePhoneRoutes = require('./routes/whitePhone.route');
const auth = require('./routes/auth.route');
const whatsappwebRoutes = require('./routes/whatsapp-web.route');
const cloudinaryController = require('./controller/cloudinary.controller');

// Middlewares
// app.use(cors());

app.use(cors({
    origin: 'http://149.50.148.138', // Reemplaza con la URL de tu frontend
    credentials: true,
}));

app.use(bodyParser.json());
app.use('/auth', auth);

// Use routes
// app.use('/whatsapp', whatsappRoutes);
app.use('/whatsapp-web', whatsappwebRoutes);
app.use('/salesman', salesPhonesRoutes);
app.use('/users', userRoutes);
app.use('/menu-items', menuItemRoutes);
app.use('/trip-items', tripItemRoutes);
app.use('/white-phones', whitePhoneRoutes);
app.use("/cloudinary", cloudinaryController);

// Hanlder errors
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});