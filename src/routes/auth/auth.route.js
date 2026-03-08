const express = require('express');
const { signup, login } = require('../../controllers/auth.controller.js');
const { validateSignup, validateLogin } = require('../../validation/auth.validation.js');

const router = express.Router();

// Public
router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);

module.exports = router;
