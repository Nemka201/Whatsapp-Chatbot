const UserService = require('../services/user.service');

// Manejo de errores
const handleErrors = (err, res) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
};

const createUser = async (req, res) => {
  try {
    const { nombreCompleto, numeroTelefono, usuario, contrasena } = req.body;

    // Validar campos requeridos
    if (!nombreCompleto || !numeroTelefono || !usuario || !contrasena) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newUser = await UserService.createUser({ nombreCompleto, numeroTelefono, usuario, contrasena });

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (err) {
    handleErrors(err, res);
  }
};

const loginUser = async (req, res) => {
  try {
    const { usuario, contrasena } = req.body;

    // Validar campos requeridos
    if (!usuario || !contrasena) {
      return res.status(400).json({ error: 'Missing required fields (username and password)' });
    }

    const token = await UserService.loginUser({ usuario, contrasena });

    res.json({ token });
  } catch (err) {
    handleErrors(err, res);
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await UserService.getUserById(req.params.id);
    res.json(user);
  } catch (err) {
    handleErrors(err, res);
  }
};

const userCount = async (req, res) => {
  try {
    const count = await UserService.userCount();
    res.json({ count });
  } catch (err) {
    handleErrors(err, res);
  }
};

module.exports = { createUser, loginUser, getUserById, userCount };
