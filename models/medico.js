var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var medicoSchema = new Schema({

    nombre: { type: String, required: [true, 'el usuario es necesario'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'usuario', required: true },
    hospital: { type: Schema.Types.ObjectId, ref: 'Hospital', required: [true, 'El id del hospital es obligatorio'] }
});


module.exports = mongoose.model('Medico', medicoSchema);