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
const authenticateToken = require('./middelware/auth');

// Middlewares
app.use(cors({
    origin: 'http://149.50.148.138', // Reemplaza con la URL de tu frontend
    credentials: true,
}));

app.use(bodyParser.json());
app.use('/api/auth', auth);

// Use routes
// app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/whatsapp-web', authenticateToken, whatsappwebRoutes);
app.use('/api/salesman', authenticateToken, salesPhonesRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/menu-items', authenticateToken, menuItemRoutes);
app.use('/api/trip-items', authenticateToken, tripItemRoutes);
app.use('/api/white-phones', authenticateToken, whitePhoneRoutes);
app.use("/api/cloudinary", authenticateToken, cloudinaryController);

// Hanlder errors
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});