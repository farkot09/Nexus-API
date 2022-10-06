const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const clientesSchema = new Schema({
  nit: String,
  razon_social: String,
  correo: String,
  telefono: String,
  nombre_contacto: String,
  fecha_creacion: Date,
  activo: Boolean,
});

clientesSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id // convertimos el _id en id para mejorar su tratamiento
    delete returnedObject._id // eliminamos esta propiedad de la respuesta
    delete returnedObject.__v // eliminamos esta propiedad de la respuesta
  }
})

const Cliente = model('Cliente', clientesSchema);

module.exports = Cliente;
