//requires 

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// inicializar variables 

var app = express();

// body parser

// parsr application/x-www-form-urlencoded

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json

app.use(bodyParser.json())

// importar rutas

var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');


// coneccion a la BD

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {

    if (err) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m', ' online');

})

// Rutas

app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);


// escuchar peticiones

app.listen(3000, () => {

    console.log('express server puerto 3000: \x1b[32m%s\x1b[0m', ' online');
});