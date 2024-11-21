const express = require('express');
const router = express.Router();
const adminController = require('../Controller/admin');

// Register a new admin
router.post('/register', adminController.registerAdmin);

// Login admin
router.post('/login', adminController.loginAdmin);

module.exports = router;
