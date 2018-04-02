var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var app = express();

var Usuario = require('../models/usuario');

app.post('/', (req, res) => {

    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, UsuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar usuarios',
                errors: err
            });

        }

        if (!UsuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: err
            });

        }

        if (!bcrypt.compareSync(body.password, UsuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: err
            });

        }

        // crear un token 
        UsuarioDB.password = ":)";
        var token = jwt.sign({ usuario: UsuarioDB }, SEED, { expiresIn: 15500 }) // 4 horas


        res.status(200).json({
            ok: true,
            usuario: UsuarioDB,
            token: token,
            id: UsuarioDB._id
        });

    });



});

module.exports = app;