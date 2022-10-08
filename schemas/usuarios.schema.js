const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const usuariosSchema = new Schema({
  correo:{
    type:String,
    unique:true
  },
  nombre:String,
  telefono:String,
  activo:Boolean,
  password:String,
  rol:Number,
  fecha:Date
});

usuariosSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id // convertimos el _id en id para mejorar su tratamiento
    delete returnedObject._id // eliminamos esta propiedad de la respuesta
    delete returnedObject.__v // eliminamos esta propiedad de la respuesta
  }
})

const Usuario = model('Usuario', usuariosSchema);

module.exports = Usuario;
