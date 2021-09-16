const mongoose = require('mongoose');
const chalk = require('chalk');
const bcrypt = require('bcrypt-nodejs');
const app = require('./app');
const ADMIN = require('./src/model/user.model');

require('dotenv').config({ path: 'variables.env' });

const PORT = process.env.PORT || 3000;
const HOST = 'localhost';

app.listen(PORT, () => console.log(chalk.bgGreenBright.black(`Escuchando http://${HOST}:${PORT}`)));

mongoose.Promise = global.Promise;
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    ADMIN.find({}, (err, adminEncontrado) => {
      if (err) return console.log('Error en la creacion de administrador.');
      if (adminEncontrado.length > 0) {
        return console.log(chalk.bgRedBright.whiteBright('El administrador ya existe'));
      } else {
        const adminObject = {
          id: '2016228',
          firstName: 'admin',
          lastName: 'admin',
          userName: 'adminpractica',
          email: 'admin132@gmail.com',
          rol: 'ADMIN',
          password: null,
        };

        bcrypt.hash('adminpractica', null, null, (err, passEncriptado) => {
          if (err) return console.log(err);
          adminObject.password = passEncriptado;
          const adminModel = new ADMIN(adminObject);
          adminModel.save((err, datoGuardado) => {
            if (err) return console.log('Error a la hora de guardar administrador.');
            !datoGuardado
              ? console.log('No viene el dato de admin')
              : console.log(chalk.bgBlueBright.black('Administrador creado con exito.'));
          });
        });
      }
    });
  })
  .catch((err) => console.log(err));
