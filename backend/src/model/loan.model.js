const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LOANS = Schema({
  id_bibliography: { type: Schema.ObjectId, ref: 'libraries' }, // ID del libro o revista.
  id_borrower: { type: Schema.ObjectId, ref: 'users' }, // ID persona que presto.
  loan_date: Date, // La fecha actual.
  is_returned: Boolean, // Si esta devuelto es True.
});

module.exports = mongoose.model('loans', LOANS);
