const user = require('./user.network');
const auth = require('./auth.network');
const library = require('./library.network');
const loan = require('./loan.network');

const routes = (app) => {
  app.use('/', auth);
  app.use('/user', user);
  app.use('/library', library);
  app.use('/loan', loan);
};

module.exports = routes;
