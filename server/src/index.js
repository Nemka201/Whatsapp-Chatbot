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
const whitePhoneRoutes = require('./routes/whitePhone.route');
const auth = require('./routes/auth.route');
const whatsappwebRoutes = require('./routes/whatsapp-web.route');

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use('/api/auth', auth);

// Use routes
// app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/whatsapp-web', whatsappwebRoutes);
app.use('/api/salesman', salesPhonesRoutes);
app.use('/api/users', userRoutes);
app.use('/api/menu-items', menuItemRoutes);
app.use('/api/white-phones', whitePhoneRoutes);

// Hanlder errors
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});