const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('../services/token.service');

// Error handling middleware
const handleErrors = (err, res) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
};

const createUser = async (req, res) => {
  try {
    const { nombreCompleto, numeroTelefono, usuario, contrasena } = req.body;

    // Validate required fields
    if (!nombreCompleto || !numeroTelefono || !usuario || !contrasena) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check for existing username or phone number (assuming uniqueness)
    const existingUser = await User.findOne({ $or: [{ username: usuario }, { numeroTelefono }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Username or phone number already exists' });
    }

    // Hash password securely before saving
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const newUser = new User({
      nombreCompleto,
      numeroTelefono,
      usuario,
      contrasena: hashedPassword,
      fechaAlta: Date.now(),
      ingresos: [],
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    handleErrors(err, res);
  }
};

const loginUser = async (req, res) => {
  try {
    const { usuario, contrasena } = req.body;

    // Validate required fields
    if (!usuario || !contrasena) {
      return res.status(400).json({ error: 'Missing required fields (username and password)' });
    }

    const user = await User.findOne({ usuario });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare hashed passwords securely
    const isMatch = await bcrypt.compare(contrasena, user.contrasena);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.generateToken(user);

    res.json({ token });
  } catch (err) {
    handleErrors(err, res);
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    handleErrors(err, res);
  }
};

module.exports = { createUser, loginUser, getUserById };