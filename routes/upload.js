var express = require('express');

var fileUpload = require('express-fileupload');

var app = express();

var usuario = require('../models/usuario');
var medico = require('../models/medico');
var hospital = require('../models/hospital');


app.use(fileUpload());

var fileUpload = require('express-fileupload');
var fs = require('fs');

app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // tipos de coleccion

    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if (tiposValidos.lastIndexOf(tipo) < 0) {
        res.status(400).json({
            ok: false,
            mensaje: 'Coleccion no valida',
            err: { message: 'coleccion no valida' }
        });
    }

    if (!req.files) {

        res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            err: { message: 'Debe seleccionar una imagen' }
        });

    }

    // obtener nombre del archivo

    var archivo = req.files.imagen;

    var nombreCortado = archivo.name.split('.');

    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // extensicones validas

    var extensionesValidas = ['jpg', 'png', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {

        res.status(400).json({
            ok: false,
            mensaje: 'EXTENSION NO VALIDA',
            err: { message: 'Las extensiones validas son:' + extensionesValidas.join(', ') }
        });


    }

    // Nombre de archivo perzonalizado


    var nombreArchivo = `${ id }-${new Date().getMilliseconds()}.${extensionArchivo}`;

    // mover el archivo 

    var path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path, err => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archvio',
                err: err
            });
        }


        subirPorTipo(tipo, id, nombreArchivo, res);


        /* res.status(200).json({
            ok: true,
            mensaje: 'archivo movido',
            nombreCortado: extensionArchivo

        });*/



    })


});

function subirPorTipo(tipo, id, nombreArchivo, res) {


    if (tipo === 'usuarios') {

        usuario.findById(id, (err, usuario) => {


            if (!usuario) {

                return res.status(400).json({
                    ok: false,
                    mensaje: 'usuario no existe',
                    mensaje: { message: 'Usuario no exite' }

                });
            }

            pathViejo = './upload/usuarios/' + usuario.img;

            // si existe elimina la anterior

            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {

                usuarioActualizado.password = ":)";

                return res.status(200).json({
                    ok: true,
                    mensaje: 'imagen actualizada',
                    usuarioActualizado: usuarioActualizado

                });

            });


        });

    }

    if (tipo === 'medicos') {

        medico.findById(id, (err, medico) => {

            if (!medico) {

                return res.status(400).json({
                    ok: false,
                    mensaje: 'medico no existe',
                    mensaje: { message: 'Medico no exite' }

                });
            }

            pathViejo = './uploads/medicos/' + medico.img;

            // si existe elimina la anterior

            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            medico.img = nombreArchivo;

            medico.save((err, medicoActualizado) => {



                return res.status(200).json({
                    ok: true,
                    mensaje: 'imagen actualizada',
                    medicoActualizado: medicoActualizado

                });

            });


        });

    }


    if (tipo === 'hospitales') {

        hospital.findById(id, (err, hospital) => {

            if (!hospital) {

                return res.status(400).json({
                    ok: false,
                    mensaje: 'hospital no existe',
                    mensaje: { message: 'hospital no exite' }

                });
            }

            pathViejo = './uploads/hospitales/' + hospital.img;

            // si existe elimina la anterior

            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            hospital.img = nombreArchivo;

            hospital.save((err, hospitalActualizado) => {



                return res.status(200).json({
                    ok: true,
                    mensaje: 'imagen actualizada',
                    hospitalActualizado: hospitalActualizado

                });

            });


        });

    }


}


module.exports = app;