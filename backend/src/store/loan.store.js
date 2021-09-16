const model = require('../model/loan.model');

async function findPrestamo(id) {
  return await model.find({ id_borrower: id, is_returned: false }).populate('id_bibliography');
}

async function findPrestamoForHistory(id) {
  return await model.find({ id_borrower: id }).populate('id_bibliography');
}

async function createPrestamo(objPrestamo) {
  const newPrestamo = new model(objPrestamo);
  return await newPrestamo.save();
}

async function findLoadById(id) {
  return await model.findById(id);
}

async function updateLoad(id, is_returned) {
  return await model.findByIdAndUpdate(id, { is_returned }, { new: true });
}

async function findLoad(id_borrower) {
  return await model.find({ id_borrower });
}

async function countUser() {
  return await model.aggregate([
    {
      $group: {
        _id: '$id_borrower',
        count: {
          $sum: 1,
        },
      },
    },
    {
      $lookup: {
        from: 'users', // He probado con 'Categories' y 'categories'
        localField: '_id',
        foreignField: '_id',
        as: '_id',
      },
    },
  ]);
}

module.exports = {
  findPrestamo,
  createPrestamo,
  findLoadById,
  updateLoad,
  findLoad,
  countUser,
  findPrestamoForHistory,
};
