const RESPONSE = require('../utils/response');
const {
  findByIdUser,
  CreateLibrary,
  viewLibraryAll,
  findByTitleLibrary,
  findByIdLibrary,
  updateLibrary,
  deleteLibraryById,
  buscarPorName,
  updateLibrarySearch,
  findRolLibrary,
} = require('../store/library.store');

// Creando un libros/revista
function createLibraryMethod(req, res, libaryAdd) {
  CreateLibrary(libaryAdd)
    .then((libroCreado) => {
      if (libroCreado) {
        return RESPONSE.success(req, res, libroCreado, 200);
      } else {
        return RESPONSE.error(req, res, 'Libro no creado', 404);
      }
    })
    .catch((err) => {
      console.log(err);
      return RESPONSE.error(req, res, 'Error Interno', 500);
    });
}

async function createLibrary(req, res) {
  if (req.user.rol != 'ADMIN' || req.user.rol != 'BIBLIOTECARIO')
    return RESPONSE.error(req, res, 'No tienes los permisos de administrador necesarios.', 401);
  const { author, title, edition, description, keywords, theme, rol, copy, available } = req.body;
  delete req.body.cant_searches;
  delete req.body.cant_lend;
  delete req.body.id_creator;

  const rolAdd = rol.toUpperCase();

  const libaryAdd = {
    author,
    title,
    edition,
    description,
    keywords,
    theme,
    rol: rolAdd,
    copy,
    available,
    cant_searches: 0,
    cant_lend: 0,
    creation_date: new Date(),
    id_creator: null,
    // Revista
    Actual_Frequency: null,
    Specimens: null,
  };

  await findByIdUser(req.user.sub)
    .then((usuarioEncontrado) => {
      findByTitleLibrary(title)
        .then((librosEncontrados) => {
          if (librosEncontrados) return RESPONSE.error(req, res, 'Libro/revista ya existente.', 404);
          libaryAdd.id_creator = usuarioEncontrado;

          if (usuarioEncontrado) {
            if (libaryAdd.rol == 'LIBRO') {
              createLibraryMethod(req, res, libaryAdd);
            } else if (libaryAdd.rol == 'REVISTA') {
              const { Actual_Frequency, Specimens } = req.body;
              libaryAdd.Actual_Frequency = Actual_Frequency;
              libaryAdd.Specimens = Specimens;
              createLibraryMethod(req, res, libaryAdd);
            } else {
              return RESPONSE.error(req, res, 'No tienes el rol necesario', 401);
            }
          } else {
            return RESPONSE.error(req, res, 'No se a podido encontrar este usuario.');
          }
        })
        .catch((err) => {});
    })
    .catch((err) => {
      console.log(err);
      return RESPONSE.error(req, res, 'Error Interno', 500);
    });
}

// Visualizar todos los libros y revistas.
async function viewAllLibrary(req, res) {
  await viewLibraryAll()
    .then((librosEncontraos) => {
      librosEncontraos
        ? RESPONSE.success(req, res, librosEncontraos, 200)
        : RESPONSE.error(req, res, 'No se pudo encontrar ningun libro.', 404);
    })
    .catch((err) => {
      console.log(err);
      return RESPONSE.error(req, res, 'Error Interno', 500);
    });
}

// Editar un libro o revista.
function editLibraryMethod(req, res, libraryEncontrado, body) {
  updateLibrary(libraryEncontrado.id, body)
    .then((libraryUpdated) => {
      libraryUpdated ? RESPONSE.success(req, res, libraryUpdated, 200) : RESPONSE.error(req, res, 'No se puede modificar este libro.', 404);
    })
    .catch((err) => {
      console.log(err);
      return RESPONSE.error(req, res, 'Error Interno', 500);
    });
}
async function editLibrary(req, res) {
  if (req.user.rol != 'ADMIN') return RESPONSE.error(req, res, 'No tienes los permisos de administrador necesarios.', 401);

  const body = req.body;
  const { idLIbrary } = req.params;

  delete body.cant_searches;
  delete body.cant_lend;
  delete body.id_creator;

  await findByIdLibrary(idLIbrary)
    .then((libraryEncontrado) => {
      if (!libraryEncontrado) return RESPONSE.error(req, res, 'Este libro no existe.', 404);

      if (libraryEncontrado.rol == 'LIBRO') {
        delete body.Actual_Frequency;
        delete body.Specimens;
        editLibraryMethod(req, res, libraryEncontrado, body);
      } else if (libraryEncontrado.rol == 'REVISTA') {
        editLibraryMethod(req, res, libraryEncontrado, body);
      }
    })
    .catch((err) => {
      console.log(err);
      return RESPONSE.error(req, res, 'Error Interno', 500);
    });
}

// Eliminar un libro
async function deleteLibrary(req, res) {
  if (req.user.rol != 'ADMIN') return RESPONSE.error(req, res, 'No tienes los permisos de administrador necesarios.', 401);
  const { idLIbrary } = req.params;

  await findByIdLibrary(idLIbrary)
    .then((libraryEncontrado) => {
      if (!libraryEncontrado) return RESPONSE.error(req, res, 'Este libro no existe.', 404);

      deleteLibraryById(libraryEncontrado._id)
        .then((libraryEliminado) => {
          libraryEliminado
            ? RESPONSE.success(req, res, libraryEliminado, 200)
            : RESPONSE.error(req, res, 'No se puede eliminar este libro/revista', 500);
        })
        .catch((err) => {
          console.log(err);
          return RESPONSE.error(req, res, 'Error Interno', 500);
        });
    })
    .catch((err) => {
      console.log(err);
      return RESPONSE.error(req, res, 'Error Interno', 500);
    });
}

// Buscar libro por ID
async function findLibaryID(req, res) {
  if (req.user.rol != 'ADMIN') return RESPONSE.error(req, res, 'No tienes los permisos de administrador necesarios.', 401);
  const { idLibrary } = req.params;
  await findByIdLibrary(idLibrary)
    .then((libraryFind) => {
      libraryFind ? RESPONSE.success(req, res, libraryFind, 200) : RESPONSE.error(req, res, 'Usuario no existente.', 404);
    })
    .catch((err) => {
      console.log(err);
      return RESPONSE.error(req, res, 'Error Interno', 500);
    });
}

async function findForName(req, res) {
  const { title } = req.body;
  buscarPorName(title)
    .then((libroEncontrado) => {
      if (!libroEncontrado) return RESPONSE.error(req, res, 'Libro/revista no encontrado.', 404);

      if (libroEncontrado.length == 1) {
        updateLibrarySearch(libroEncontrado[0]._id, libroEncontrado[0].cant_searches)
          .then((updateSearch) => {
            updateSearch ? RESPONSE.success(req, res, updateSearch, 200) : RESPONSE.error(req, res, 'No se puede actualizar el libro', 500);
          })
          .catch((err) => {
            console.log(err);
            return RESPONSE.error(req, res, 'Error Interno', 500);
          });
      } else {
        return RESPONSE.error(req, res, 'El resultado trae más de un libro/revista.', 404);
      }
    })
    .catch((err) => {
      console.log(err);
      return RESPONSE.error(req, res, 'Error Interno', 500);
    });
}

async function libraryMasPrestados(req, res) {
  const { rol } = req.body;
  const roles = rol.toUpperCase();

  findRolLibrary(roles, req.route.path)
    .then((responseLibrary) => {
      responseLibrary ? RESPONSE.success(req, res, responseLibrary, 200) : RESPONSE.error(req, res, 'No hay ningun libro aun.', 404);
    })
    .catch((err) => {
      return RESPONSE.error(req, res, 'Error Interno', 500, err);
    });
}

module.exports = {
  createLibrary,
  viewAllLibrary,
  editLibrary,
  deleteLibrary,
  findLibaryID,
  findForName,
  libraryMasPrestados,
};
