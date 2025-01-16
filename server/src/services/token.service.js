const jwt = require('jsonwebtoken');

// Función para verificar el token JWT
const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        return decoded;
    } catch (error) {
        return null;
    }
};

// Funcion para crear el token JWT
function generateToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}

module.exports = {
    generateToken,
    verifyToken
};