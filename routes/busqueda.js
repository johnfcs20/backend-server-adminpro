var express = require('express');

var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

// ==========================
// Busqueda por coleccion   =
// ==========================

app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i');

    var promesa;

    switch (tabla) {

        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;

        case 'medicos':
            promesa = buscarMedicos(busqueda, regex);
            break;

        case 'hospitales':
            promesa = buscarHospitales(busqueda, regex);
            break;

        default:

            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda solo son: usuarios, medicos y hospitales',
                error: { message: 'Coleccion / tabla no valida' }
            });

    }


    promesa.then((data) => {

        return res.status(200).json({
            ok: true,
            [tabla]: data

        });

    })



});




// ===================
// Busqueda general  =
// ===================

app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    Promise.all([
            buscarHospitales(busqueda, regex),
            buscarMedicos(busqueda, regex),
            buscarUsuarios(busqueda, regex)
        ])
        .then(respuestas => {


            res.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
            });

        })

});

// Busqueda hospital 
function buscarHospitales(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Hospital.find({ nombre: regex })
            .populate('usuarios', 'nombre email')
            .exec((err, hospitales) => {

                if (err) {
                    reject('Error al cargar hospitales', err);
                } else {

                    resolve(hospitales);

                }


            });
    });
}

// // Busqueda medicos 
function buscarMedicos(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Medico.find({ nombre: regex })
            .populate('usuario', 'nomrbe email')
            .populate('hospital')
            .exec((err, medicos) => {

                if (err) {
                    reject('Error al cargar medicos', err);
                } else {

                    resolve(medicos);

                }

            });

    });
}




// Buscar usuario 

function buscarUsuarios(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre email role img')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }
            })

    });
}




module.exports = app;