const express = require('express');
const router = express.Router();
const {
  editUser,
  editMe,
  dropUser,
  deleteMe,
  accountDetails,
  crearUusuarios,
  viewUsersAll,
  viewoneUser,
} = require('../controllers/user.controller');
const { verifyAuth } = require('../utils/verify-auth');

/* Peticiones POST */
router.post('/crearUsers', verifyAuth, crearUusuarios);

/* Peticiones GET */
router.get('/accountDetails', verifyAuth, accountDetails);
router.get('/allUsers', verifyAuth, viewUsersAll);
router.get('/oneUser/:idUser', verifyAuth, viewoneUser);

/* Peticiones PUT */
router.put('/editUser/:idUser', verifyAuth, editUser);
router.put('/editMe', verifyAuth, editMe);

/* Peticiones DELETE */
router.delete('/dropUser/:idUser', verifyAuth, dropUser);
router.delete('/deleteMe/', verifyAuth, deleteMe);

module.exports = router;
