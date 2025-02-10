const express = require('express');
const router = express.Router();
const authenticateToken = require('../middelware/auth');

router.get('/protected-route', authenticateToken, (req, res) => {
    // Solo usuarios autenticados pueden acceder a esta ruta
    res.json({ message: 'Welcome ' + req.user.name });
});

module.exports = router;