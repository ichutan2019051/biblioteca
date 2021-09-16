const jwt = require('jwt-simple');
const moment = require('moment');
const SECRET = 'proyecto_biblioteca';
const RESPONSE = require('./response');

exports.verifyAuth = function (req, res, next) {
  if (!req.headers.authorization) {
    return RESPONSE.error(req, res, 'No tiene el TOKEN.', 404);
    // return RESPONSE.success(req, res, { userEncontrado }, 200);
  }

  let token = req.headers.authorization.replace(/['"]+/g, '');
  let payload;
  try {
    payload = jwt.decode(token, SECRET);
    if (payload.exp <= moment().unix()) {
      return res.status(401).send({
        mensaje: 'El token ha expirado.',
      });
    }
  } catch (error) {
    console.error(error);
    return RESPONSE.error(req, res, 'El token no es valido', 404);
  }

  req.user = payload;
  next();
};
