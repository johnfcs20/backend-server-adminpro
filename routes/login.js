var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var app = express();

var Usuario = require('../models/usuario');

const GOOGLE_CLIENT_ID = require('../config/config').GOOGLE_CLIENT_ID;
const GOOGLE_SECRET = require('../config/config').GOOGLE_SECRET;

const { OAuth2Client } = require('google-auth-library');



// ======================
// Autenticacion google =
// ======================

app.post('/google', (req, res) => {

    var token = req.body.token || 'xxx';
    const client = new OAuth2Client(GOOGLE_CLIENT_ID);

    async function verify() {


        /* if (e) {

            return res.status(400).json({

                ok: true,
                mensaje: 'Token no valido',
                errors: e

            });

        }*/

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: GOOGLE_CLIENT_ID // Specify the CLIENT_ID of the app that accesses the backend
                // Or, if multiple clients access the backend:
                //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        // If request specified a G Suite domain:
        //const domain = payload['hd'];


        Usuario.findOne({ email: payload.email }, (err, usuario) => {

            if (err) {

                return res.status(500).json({

                    ok: true,
                    mensaje: 'error al buscar usuario login',
                    errors: err

                });

            }

            if (usuario) {

                if (usuario.google === false) {

                    return res.status(500).json({

                        ok: true,
                        mensaje: 'Debe usar su autenticacion normal',


                    });

                } else {

                    usuario.password = ":)";

                    var token = jwt.sign({ usuario: usuario }, SEED, { expiresIn: 15500 }) // 4 horas


                    res.status(200).json({
                        ok: true,
                        usuario: usuario,
                        token: token,
                        id: usuario._id
                    });

                }

                // si el usuario no existe por correo

            } else {

                var usuario = new Usuario();
                usuario.nombre = payload.name;
                usuario.email = payload.email;
                usuario.password = ':)';
                usuario.img = payload.picture;
                usuario.google = true;

                usuario.save((err, UsuarioDB) => {

                    if (err) {
                        return res.status(500).json({
                            ok: true,
                            mensaje: 'error al crear usuario - google',
                            errors: err,
                            UsuarioDB: UsuarioDB
                        })
                    }

                });

            }

            var token = jwt.sign({ usuario: UsuarioDB }, SEED, { expiresIn: 15500 }) // 4 horas


            res.status(200).json({
                ok: true,
                usuario: usuario,
                token: token,
                id: usuario._id
            });



        });



    } //fin verify 


    verify().catch(error => {



        return res.status(400).json({

            ok: false,
            mensaje: 'Token no valido',
            errors: error

        })





    }); // fin catch





}); // final post

// ======================
// Autenticacion normal =
// ======================
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