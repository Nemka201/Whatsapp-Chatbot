const express = require('express');
const router = express.Router();
const userController = require('../controller/user.controller.js');

// HandleError
const handleErrors = (err, res) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
};

// User routes
router.post('/register', userController.createUser, handleErrors); // Create user
router.post('/login', userController.loginUser, handleErrors); // Login user
router.get('/count', userController.userCount, handleErrors); // Get user count
router.get('/:id', userController.getUserById, handleErrors); // Get user by ID

module.exports = router;