require('../database/mongoConnect');
const boom = require('@hapi/boom');
const Log = require('../schemas/logs.schema');

class LogsServices {
  async find() {
    let data = {};
    await Log.find({}).then((logs) => {
      return (data = logs);
    });

    return data;
  }

  async create(data) {
    let isSaved = {}
    const {
      tipo,
      id_tipo,
      accion,
      id_usuario,
      //fecha
    } = data;
    const newLog = new Log({
      tipo:tipo.trim(),
      id_tipo,
      accion:accion.trim(),
      id_usuario,
      fecha: new Date(),
    });

    await newLog.save().then(savedLog =>{
      return isSaved = savedLog
    }).catch(err => {
      return isSaved = err
    })

    if(isSaved.errors){
      throw boom.notFound(`No se pudo guardar el Log ${isSaved._message}`)
    }
    return isSaved
  }

  async findByTipe(tipo){
    let data = {}
    await Log.find({tipo}).then(logs => {
      return data = logs
    })
    return data
  }
}

module.exports = LogsServices
