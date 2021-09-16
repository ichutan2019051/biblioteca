/* Importaciones de librarias internas */
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./src/router/index');

const cors = require('cors');

/* Funciones de app */
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({origin: 'https://biblioteca-26160.web.app'}));
routes(app);

module.exports = app;
