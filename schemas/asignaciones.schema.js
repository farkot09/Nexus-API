const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const asignacionesSchema = new Schema({
  roe: String,
  booking: String,
  modalidad: String,
  cantidad: String,
  peso: String,
  cubicaje: String,
  producto: String,
  destino_final: String,
  medidas: String,
  agencia_aduanas: String,
  fecha_creacion: Date,
  activo: Boolean,
  id_reserva: String,
  id_cliente: String,
});

asignacionesSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id; // convertimos el _id en id para mejorar su tratamiento
    delete returnedObject._id; // eliminamos esta propiedad de la respuesta
    delete returnedObject.__v; // eliminamos esta propiedad de la respuesta
  },
});

const Asignacion = model('Asignacion', asignacionesSchema);

module.exports = Asignacion;
