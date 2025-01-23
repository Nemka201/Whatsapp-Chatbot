const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller.js');
const handleErrors = (err, res) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
};

// User routes
router.post('/users', userController.createUser, handleErrors); // Create user
router.post('/login', userController.loginUser, handleErrors); // Login user
router.get('/users/:id', userController.getUserById, handleErrors); // Get user by ID
router.get('/users/count', userController.userCount, handleErrors); // Get user count

module.exports = router;