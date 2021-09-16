const model = require('../model/library.model');
const modelUser = require('../model/user.model');

async function findByIdUser(id) {
  return await modelUser.findById(id);
}

async function CreateLibrary(objectLibrary) {
  const newLibrary = new model(objectLibrary);
  return await newLibrary.save();
}

async function viewLibraryAll() {
  return await model.find();
}

async function findByTitleLibrary(title) {
  return await model.findOne({ title });
}

async function findByIdLibrary(id) {
  return await model.findById(id);
}

async function updateLibrary(id, body) {
  return await model.findByIdAndUpdate(id, body, { new: true });
}

async function deleteLibraryById(id) {
  return await model.findByIdAndDelete(id);
}

async function updateLibreria(id, availableOld, cant_lendOld) {
  return await model.findByIdAndUpdate(
    id,
    {
      available: availableOld - 1,
      cant_lend: cant_lendOld + 1,
    },
    { new: true }
  );
}

async function updateLibrariaPrestamo(id, availableOld, cant_lendOld) {
  return await model.findByIdAndUpdate(
    id,
    {
      available: availableOld + 1,
      cant_lend: cant_lendOld - 1,
    },
    { new: true }
  );
}

async function buscarPorName(nameFind) {
  return await model.aggregate([
    {
      $unwind: '$title',
    },
    {
      $match: { title: { $regex: nameFind, $options: 'i' } },
    },
    {
      $group: {
        _id: '$_id',
        author: { $first: '$author' },
        title: { $first: '$title' },
        description: { $first: '$description' },
        keywords: { $first: '$keywords' },
        theme: { $first: '$theme' },
        rol: { $first: '$rol' },
        copy: { $first: '$copy' },
        available: { $first: '$available' },
        cant_searches: { $first: '$cant_searches' },
        cant_lend: { $first: '$cant_lend' },
        id_creator: { $first: '$id_creator' },
        Actual_Frequency: { $first: '$Actual_Frequency' },
        Specimens: { $first: '$Specimens' },
      },
    },
  ]);
}

async function updateLibrarySearch(id, cant_searchesOld) {
  return await model.findByIdAndUpdate(id, { cant_searches: cant_searchesOld + 1 }, { new: true });
}

async function findRolLibrary(rol, campo) {
  if (campo == '/mostSearch') {
    return await model.find({ rol }).sort({ cant_searches: -1 });
  } else if (campo == '/mostLend') {
    return await model.find({ rol }).sort({ cant_lend: -1 });
  }
}

module.exports = {
  findByIdUser,
  CreateLibrary,
  viewLibraryAll,
  findByTitleLibrary,
  findByIdLibrary,
  updateLibrary,
  deleteLibraryById,
  updateLibreria,
  updateLibrariaPrestamo,
  buscarPorName,
  updateLibrarySearch,
  findRolLibrary,
};
