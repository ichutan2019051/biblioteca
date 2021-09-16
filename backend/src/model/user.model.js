const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const USER = Schema({
  id: String, // Carnet o CUI
  firstName: String,
  lastName: String,
  userName: String, // Unico e irrepetible.
  email: String,
  rol: String, // Estudiante, Bibliotecario o admin.
  password: String, // Password incriptado.
});

module.exports = mongoose.model('users', USER);
