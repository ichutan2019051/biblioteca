const bcrypt = require('bcrypt-nodejs');
const { findWithUser, createUser } = require('../store/auth.store');
const { findByCarnet } = require('../store/user.store');
const RESPONSE = require('../utils/response');
const jwt = require('../utils/jwt');

// Login General
async function login(req, res) {
  const { userName, password } = req.body;

  await findWithUser(userName)
    .then((Encontrado) => {
      if (Encontrado) {
        responderToken(req, res, password, Encontrado.password, Encontrado);
      } else {
        return RESPONSE.error(req, res, 'Usuario incorrecto.', 404);
      }
    })
    .catch((err) => console.log('err', err));
}

function responderToken(req, res, password, passwordEncontrado, dataEncontrada) {
  bcrypt.compare(password, passwordEncontrado, (err, passDesincriptado) => {
    if (err) return RESPONSE.error(req, res, err, 500);
    !passDesincriptado
      ? RESPONSE.error(req, res, 'La contraseña es incorrecta.')
      : RESPONSE.success(req, res, jwt.createToken(dataEncontrada), 200);
  });
}

async function register(req, res) {
  const { id, userName, firstName, lastName, email, password, rol } = req.body;
  const rolAdd = rol.toUpperCase();
  if (firstName && lastName && userName && password) {
    await findWithUser(userName)
      .then((usuarioEncontrado) => {
        findByCarnet(id)
          .then((userEncontado) => {
            if (userEncontado) {
              return RESPONSE.error(req, res, 'Usuario ya existente con este CUI/CARNÉ.', 404);
            } else {
              if (usuarioEncontrado) {
                return RESPONSE.error(req, res, 'Usuario ya existente con este USERNAME.', 404);
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
          .catch((err) => {});
      })
      .catch((err) => console.log('err', err));
  } else {
    return RESPONSE.error(req, res, 'Faltan llenar algunos campos.', 404);
  }
}

module.exports = {
  login,
  register,
};
