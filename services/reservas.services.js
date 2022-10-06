require('../database/mongoConnect');
const boom = require('@hapi/boom');
const Reserva = require('../schemas/reservas.schema');
//const mongoose = require('mongoose');

class ReservasServices {
  constructor() {
    this.reservas = [];
  }

  //CREAR RESERVA

  async create(data) {
    const {
      numero_reserva,
      destino,
      resumen,
      vassel,
      //fecha_reserva,
      //fecha_cierre,
      activo,
    } = data;
    const newReserva = new Reserva({
      numero_reserva,
      destino,
      resumen,
      vassel,
      fecha_reserva: new Date(),
      fecha_cierre: new Date(),
      activo,
    });
    let isSaved = {};

    await newReserva
      .save()
      .then((savedRerserva) => {
        return (isSaved = savedRerserva);
      })
      .catch((err) => {
        return (isSaved = err);
      });

    if (isSaved.errors) {
      throw boom.notFound(`Reserva not Created, ${isSaved._message}`);
    }
    return newReserva;
  }

  //TODAS LAS RESERVAS

  async find() {
    await Reserva.find({}).then((result) => {
      this.reservas = result;
    });
    return this.reservas;
  }

  // ENCONTRAR UNA RESERVA

  async findOne(id) {
    let ifExist = {};
    await Reserva.findById(id)
      .then((reserva) => {
        if(!reserva){
          return ifExist = {message:"No existe el id"}
        }
        return (ifExist = reserva);
      })
      .catch((err) => {
        return (ifExist = err);
      });

      console.log(ifExist);
    if (ifExist.message) {
      throw boom.badRequest(`error, invalid id , ${ifExist.message}`);
    }
    return ifExist;
  }

  // ACTUALIZACION DE RESERVA

  async update(id, changes) {
    let isUpdate = {};
    const newReservaInfo = new Reserva({
      _id: id,
      numero_reserva: changes.numero_reserva,
      destino: changes.destino,
      resumen: changes.resumen,
      vassel: changes.vassel,
      fecha_reserva: new Date(),
      fecha_cierre: new Date(),
      activo: changes.activo,
    });

    await Reserva.findByIdAndUpdate(id, newReservaInfo, { new: true })
      .then((note) => {
        if(!note){
          return isUpdate = {message:"No existe el id"}
        }
        return (isUpdate = note);
      })
      .catch((err) => {
        return (isUpdate = err);
      });

    if (isUpdate.message) {
      throw boom.badRequest(`error not exist or , ${isUpdate.message}`);
    }

    return isUpdate;
  }

  async delete(id) {
    let isDelete = {};
    await Reserva.findByIdAndRemove(id).then(reserva => {
      if(!reserva){
        return isDelete = {message:"No existe el Id"}
      }
      return isDelete = reserva
    }).catch(err => {
      return isDelete = err
    })
    if(isDelete.message){
      throw boom.badRequest(`error, not exist or, ${isDelete.message}`)
    }
    return {
      message: "ELiminado exitosamente",
      id,
    }

  }
}

module.exports = ReservasServices;
