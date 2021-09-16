const RESPONSE = require('../utils/response');
const { updateUser, findUserID, deleteUser, viewAllUsers, findByCarnet } = require('../store/user.store');
const { createUser, findWithUser } = require('../store/auth.store');
const bcrypt = require('bcrypt-nodejs');

// Crear usuarios
async function crearUusuarios(req, res) {
  if (req.user.rol != 'ADMIN' || req.user.rol != 'BIBLIOTECARIO') return RESPONSE.error(req, res, 'No tienes los permisos de administrador necesarios.', 401);

  const { id, userName, firstName, lastName, email, password, rol } = req.body;
  const rolAdd = rol.toUpperCase();
  if (firstName && lastName && userName && password) {
    await findWithUser(userName)
      .then((usuarioEncontrado) => {
        findByCarnet(id)
          .then((userEncontrado) => {
            if (userEncontrado) {
              return RESPONSE.error(req, res, 'Usuario ya existente con este CUI/CARNÉ.', 404);
            } else {
              if (usuarioEncontrado) {
                return RESPONSE.error(req, res, 'Usuario ya existente con este userName.', 404);
              } else {
                bcrypt.hash(password, null, null, (err, passEncriptado) => {
                  if (err) return RESPONSE.error(req, res, 'No se puede incriptar el password.', 404);

                  const people = {
                    id, // Carne - CUI
                    userName,
                    firstName,
                    lastName,
                    email,
                    password: passEncriptado,
                    rol: rolAdd, // admin
                  };
                  createUser(people)
                    .then((userCreate) => {
                      userCreate
                        ? RESPONSE.success(req, res, userCreate, 201)
                        : RESPONSE.error(req, res, 'No se puede crear el usuario.', 500);
                    })
                    .catch((err) => console.log(err));
                });
              }
            }
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
  } else {
    return RESPONSE.error(req, res, 'Faltan llenar algunos campos.', 404);
  }
}

// Function for admin / Edit Any user
async function editUser(req, res) {
  if (req.user.rol != 'ADMIN') return RESPONSE.error(req, res, 'No tienes permisos para editar usuario', 401);

  const userBody = req.body;
  delete userBody._id;
  delete userBody.id;
  delete userBody.userName;
  delete userBody.password;

  const { idUser } = req.params;

  await findUserID(idUser)
    .then((usuarioEncontrado) => {
      if (usuarioEncontrado) {
        if (usuarioEncontrado.rol === 'ESTUDIANTE' || 'BIBLIOTECARIO') {
          updateUser(idUser, userBody)
            .then((usuarioModificado) => {
              usuarioModificado
                ? RESPONSE.success(req, res, { usuarioModificado }, 200)
                : RESPONSE.error(req, res, 'No se puede modificar a un admin.', 500);
            })
            .catch((err) => {
              console.log(err);
              return RESPONSE.error(req, res, 'Error Interno', 500);
            });
        } else {
          return RESPONSE.error(req, res, 'No puedes modificar a un ADMIN.', 404);
        }
      } else {
        return RESPONSE.error(req, res, 'Usuario No existente.', 404);
      }
    })
    .catch((err) => {
      console.log(err);
      return RESPONSE.error(req, res, 'Error Interno', 500);
    });
}

// Function for admin / Delete Any user

async function dropUser(req, res) {
  if (req.user.rol != 'ADMIN') return RESPONSE.error(req, res, 'Unicamente los administradores pueden eliminar otros usuarios', 401);

  const { idUser } = req.params;

  await findUserID(idUser)
    .then((usuarioEncontrado) => {
      if (usuarioEncontrado) {
        if (usuarioEncontrado.rol === 'ESTUDIANTE' || 'BIBLIOTECA') {
          deleteUser(idUser)
            .then((usuarioEliminado) => {
              usuarioEliminado
                ? RESPONSE.success(req, res, { usuarioEliminado }, 200)
                : RESPONSE.error(req, res, 'No se puedes eliminar un admin.', 500);
            })
            .catch((err) => {
              console.log(err);
              return RESPONSE.error(req, res, 'Error Interno', 500);
            });
        } else {
          return RESPONSE.error(req, res, 'No puedes eliminar a un ADMIN.', 404);
        }
      } else {
        return RESPONSE.error(req, res, 'Usuario No existente.', 404);
      }
    })
    .catch((err) => {
      console.log(err);
      return RESPONSE.error(req, res, 'Error Interno', 500);
    });
}

async function editMe(req, res) {
  const userBody = req.body;
  delete userBody._id;
  delete userBody.id;
  delete userBody.userName;
  delete userBody.rol;
  delete userBody.password;

  await updateUser(req.user.sub, userBody)
    .then((usuarioModificado) => {
      usuarioModificado
        ? RESPONSE.success(req, res, { usuarioModificado }, 200)
        : RESPONSE.error(req, res, 'No se editar  el usuario.', 500);
    })
    .catch((err) => {
      console.log(err);
      return RESPONSE.error(req, res, 'Error Interno', 500);
    });
}

async function deleteMe(req, res) {
  await findUserID(req.user.sub)
    .then((usuarioEncontrado) => {
      if (usuarioEncontrado) {
        deleteUser(req.user.sub)
          .then((usuarioEliminado) => {
            if (usuarioEliminado) {
              return RESPONSE.success(req, res, usuarioEliminado, 200);
            } else {
              return RESPONSE.error(req, res, 'Usuario ingresado no existe.');
            }
          })
          .catch((err) => {
            console.log(err);
            return RESPONSE.error(req, res, 'Error Interno', 500);
          });
      } else {
        return RESPONSE.error(req, res, 'Este usuario no existe.', 500);
      }
    })
    .catch((err) => {
      console.log(err);
      return RESPONSE.error(req, res, 'Error Interno', 500);
    });
}

async function accountDetails(req, res) {
  await findUserID(req.user.sub)
    .then((usuarioEncontrado) => {
      if (usuarioEncontrado) {
        return RESPONSE.success(req, res, usuarioEncontrado, 200);
      } else {
        return RESPONSE.error(req, res, 'Usuario ingresado no existe.');
      }
    })
    .catch((err) => {
      console.log(err);
      return RESPONSE.error(req, res, 'Error Interno', 500);
    });
}

async function viewUsersAll(req, res) {
  // if (req.user.rol != 'ADMIN') return RESPONSE.error(req, res, 'No tienes los permisos de admin necesarios', 401);

  viewAllUsers()
    .then((usuariosEncontrados) => {
      usuariosEncontrados
        ? RESPONSE.success(req, res, usuariosEncontrados, 200)
        : RESPONSE.error(req, res, 'No se puede mostrar la data.', 500);
    })
    .catch((err) => {
      console.log(err);
      return RESPONSE.error(req, res, 'Error Interno', 500);
    });
}

// View one Usuario
async function viewoneUser(req, res) {
  if (req.user.rol != 'ADMIN') return RESPONSE.error(req, res, 'No tienes los permisos de admin necesarios', 401);

  const { idUser } = req.params;

  findUserID(idUser)
    .then((usuarioEncontrado) => {
      usuarioEncontrado ? RESPONSE.success(req, res, usuarioEncontrado, 200) : RESPONSE.error(req, res, 'Usuario no existente.', 404);
    })
    .catch((err) => {
      console.log(err);
      return RESPONSE.error(req, res, 'Error Interno', 500);
    });
}

module.exports = {
  editUser,
  editMe,
  dropUser,
  deleteMe,
  accountDetails,
  crearUusuarios,
  viewUsersAll,
  viewoneUser,
};
