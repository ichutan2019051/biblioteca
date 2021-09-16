const RESPONSE = require('../utils/response');
/* const { findLibrary } = require('../store/loan.store'); */
const { findUserID } = require('../store/user.store');
const { findByIdLibrary, updateLibreria, updateLibrariaPrestamo } = require('../store/library.store');
const { findPrestamo, createPrestamo, findLoadById, updateLoad, countUser, findPrestamoForHistory } = require('../store/loan.store.js');

// Function for createLoan
function updateLoan(req, res, libraryFind, usuarioEncontrado) {
  updateLibreria(libraryFind._id, libraryFind.available, libraryFind.cant_lend)
    .then((updateLibrerias) => {
      const prestamo = {
        id_bibliography: updateLibrerias,
        id_borrower: usuarioEncontrado,
        loan_date: new Date(),
        is_returned: false,
      };
      createPrestamo(prestamo)
        .then((prestamoGuardado) => {
          prestamoGuardado
            ? RESPONSE.success(req, res, prestamoGuardado, 201)
            : RESPONSE.error(req, res, 'No se puede guardar este libro.', 500);
        })
        .catch((err) => {
          return RESPONSE.error(req, res, 'Error Interno', 500, err);
        });
    })
    .catch((err) => {
      return RESPONSE.error(req, res, 'Error Interno', 500, err);
    });
}

async function createLoan(req, res) {
  // if (req.user.rol != 'ESTUDIANTE') return RESPONSE.error(req, res, 'No tienes permisos para editar usuario', 401);

  const { id_bibliography } = req.body;

  await findUserID(req.user.sub)
    .then((usuarioEncontrado) => {
      if (usuarioEncontrado) {
        findByIdLibrary(id_bibliography)
          .then((libraryFind) => {
            if (libraryFind) {
              findPrestamo(req.user.sub)
                .then((prestamoEncontrado) => {
                  if (prestamoEncontrado) {
                    if (prestamoEncontrado.length >= 10) {
                      return RESPONSE.error(req, res, 'Ya no puedes agregar más libros/revistas a tu catalogo.');
                    } else {
                      updateLoan(req, res, libraryFind, usuarioEncontrado);
                    }
                  } else {
                    updateLoan(req, res, libraryFind, usuarioEncontrado);
                  }
                })
                .catch((err) => {
                  return RESPONSE.error(req, res, 'Error Interno', 500, err);
                });
            } else {
              return RESPONSE.error(req, res, 'Libro no existente.', 500);
            }
          })
          .catch((err) => {
            return RESPONSE.error(req, res, 'Error Interno', 500, err);
          });
      } else {
        return RESPONSE.error(req, res, 'Usuario no existente.', 500);
      }
    })
    .catch((err) => {
      return RESPONSE.error(req, res, 'Error Interno', 500, err);
    });
}

// Function for me loan
async function findMeLoan(req, res) {
  await findUserID(req.user.sub)
    .then((userFind) => {
      if (userFind) {
        findPrestamoForHistory(req.user.sub)
          .then((resultFind) => {
            resultFind ? RESPONSE.success(req, res, resultFind, 200) : RESPONSE.error(req, res, 'No tienes ningun prestamos aun.', 404);
          })
          .catch((err) => {
            return RESPONSE.error(req, res, 'Error Interno', 500, err);
          });
      } else {
        return RESPONSE.error(req, res, 'Usuario no existente.', 404);
      }
    })
    .catch((err) => {
      return RESPONSE.error(req, res, 'Error Interno', 500, err);
    });
}

// Update For Loan
async function updateLoanComplete(req, res) {
  const { idLoan } = req.params;
  await findLoadById(idLoan)
    .then((prestamoEncontrado) => {
      if (prestamoEncontrado) {
        if (prestamoEncontrado.is_returned) {
          return RESPONSE.error(req, res, 'El libro ya a sido devuelto.', 404, prestamoEncontrado);
        } else {
          findByIdLibrary(prestamoEncontrado.id_bibliography._id)
            .then((libroEncontrado) => {
              if (libroEncontrado) {
                updateLoad(prestamoEncontrado._id, true)
                  .then((loadUpdated) => {
                    console.log('loadUpdated', loadUpdated);
                    if (loadUpdated) {
                      updateLibrariaPrestamo(libroEncontrado._id, libroEncontrado.available, libroEncontrado.cant_lend)
                        .then((resultadoUpdate) => {
                          console.log('resultadoUpdate', resultadoUpdate);
                          resultadoUpdate
                            ? RESPONSE.success(req, res, 'Libro devuelto con exito.', 200)
                            : RESPONSE.error(req, res, 'No se puede devolver el libro con exito.', 500);
                        })
                        .catch((err) => {
                          return RESPONSE.error(req, res, 'Error Interno', 500, err);
                        });
                    } else {
                      return RESPONSE.error(req, res, 'No se puede modificar el campo is_returned.');
                    }
                  })
                  .catch((err) => {
                    return RESPONSE.error(req, res, 'Error Interno', 500, err);
                  });
              } else {
                return RESPONSE.error(req, res, 'No se encuentra el libro.', 500);
              }
            })
            .catch((err) => {
              return RESPONSE.error(req, res, 'Error Interno', 500, err);
            });
        }
      } else {
        return RESPONSE.error(req, res, 'Este prestamo no existe.');
      }
    })
    .catch((err) => {
      return RESPONSE.error(req, res, 'Error Interno', 500, err);
    });
}

// Los usuarios con más prestamos.

async function usuarioMostPrestamos(req, res) {
  await countUser()
    .then((arrayLoad) => {
      arrayLoad ? RESPONSE.success(req, res, arrayLoad, 200) : RESPONSE.error(req, res, 'No se encuentra ningun prestamo', 404);
    })
    .catch((err) => {
      return RESPONSE.error(req, res, 'Error Interno', 500, err);
    });
}

module.exports = {
  createLoan,
  findMeLoan,
  updateLoanComplete,
  usuarioMostPrestamos,
};
