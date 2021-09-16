const express = require('express');
const router = express.Router();
const { createLoan, findMeLoan, updateLoanComplete, usuarioMostPrestamos, libraryMasPrestados } = require('../controllers/loan.controller');
const { verifyAuth } = require('../utils/verify-auth');

/* Peticiones POST */
router.post('/create', verifyAuth, createLoan);

/* Peticiones GET */
router.get('/meLoan', verifyAuth, findMeLoan);
router.get('/mostUser', verifyAuth, usuarioMostPrestamos);

/* Peticiones PUT */
router.put('/updateLoan/:idLoan', verifyAuth, updateLoanComplete);

module.exports = router;
