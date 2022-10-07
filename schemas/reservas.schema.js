const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const reservasSchema = new Schema({
  numero_reserva: String,
  destino: String,
  resumen: String,
  vassel: String,
  fecha_reserva: Date,
  fecha_cierre: Date,
  asignaciones: [],
  activo: Boolean,
});

reservasSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id // convertimos el _id en id para mejorar su tratamiento
    delete returnedObject._id // eliminamos esta propiedad de la respuesta
    delete returnedObject.__v // eliminamos esta propiedad de la respuesta
  }
})

const Reserva = model('Reserva', reservasSchema);

module.exports = Reserva;
