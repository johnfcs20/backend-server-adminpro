var express = require('express');

var fs = require('fs');

var app = express();



app.get('/:tipo/:img', (req, res, next) => {

    var tipo = req.params.tipo;
    var img = req.params.img;

    var path = `/uploads/${ tipo }/${ img }`;

    fs.exists(path, ex => {
        if (!ex) {
            path = './assets/no - img.png ';
        }

        res.sendfile(path);




    });



});

module.exports = app;