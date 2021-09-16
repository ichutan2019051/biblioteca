const express = require('express');
const router = express.Router();
const {
  createLibrary,
  viewAllLibrary,
  editLibrary,
  deleteLibrary,
  findLibaryID,
  findForName,
  libraryMasPrestados,
} = require('../controllers/library.controller');
const { verifyAuth } = require('../utils/verify-auth');

/* peticiones GET */
router.get('/libraryAll', verifyAuth, viewAllLibrary);
router.get('/oneLIbrary/:idLibrary', verifyAuth, findLibaryID);
router.post('/mostLend', verifyAuth, libraryMasPrestados);
router.post('/mostSearch', verifyAuth, libraryMasPrestados);

/* peticiones POST */
router.post('/createLibrary', verifyAuth, createLibrary);
router.post('/findName', verifyAuth, findForName);

/* peticiones PUT */
router.put('/editLibrary/:idLIbrary', verifyAuth, editLibrary);

/* peticiones DELETE */
router.delete('/dropLibrary/:idLIbrary', verifyAuth, deleteLibrary);

module.exports = router;
