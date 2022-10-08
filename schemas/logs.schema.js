const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const logsSchema = new Schema({
  tipo:String,
  id_tipo:String,
  accion:String,
  fecha:Date
});

logsSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id // convertimos el _id en id para mejorar su tratamiento
    delete returnedObject._id // eliminamos esta propiedad de la respuesta
    delete returnedObject.__v // eliminamos esta propiedad de la respuesta
  }
})

const Log = model('Log', logsSchema);

module.exports = Log;
