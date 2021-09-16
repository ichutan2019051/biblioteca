const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CATALOGO_LIBRO = Schema({
  author: String, // Autor del libro
  title: String, // Titulo del libro
  edition: String, // Edicion del libro
  description: String, // Descripcion del libro.
  keywords: String, // Palabras claves.
  theme: String, // Tema del que se trata.
  rol: String, // Revista  o Libro
  copy: Number, // Copias.
  available: Number, // Cantidad de libros disponibles.
  cant_searches: Number, // Cantidad de busquedas.
  cant_lend: Number, // Cantidad de libros/revistas prestados.
  creation_date: Date, // Fecha de creacion.
  id_creator: { type: Schema.ObjectId, ref: 'users' }, // El que crea la revista/libro.

  /* Solo para revistas */
  Actual_Frequency: String, // Frecuencia Actual.
  Specimens: String, // Ejemplares del libro.
});

module.exports = mongoose.model('libraries', CATALOGO_LIBRO);
