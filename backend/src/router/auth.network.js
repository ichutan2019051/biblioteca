const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/auth.controller');

/* Peticiones POST */
router.post('/logIn', login);
router.post('/signUp', register);

module.exports = router;
