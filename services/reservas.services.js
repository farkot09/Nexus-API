require('../database/mongoConnect');
const boom = require('@hapi/boom');
const Reserva = require('../schemas/reservas.schema');
const LogsServices = require("../services/logs.services");

const logService = new LogsServices();
//const mongoose = require('mongoose');
class ReservasServices {
  constructor() {
    this.reservas = [];
    this.sesionIdUsuario = "Sin Registrar"
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
     // asignaciones,
      activo,
    } = data;
    const newReserva = new Reserva({
      numero_reserva:numero_reserva.toUpperCase().trim(),
      destino:destino.toUpperCase().trim(),
      resumen:resumen.toUpperCase().trim(),
      vassel:vassel.toUpperCase().trim(),
      fecha_reserva: new Date(),
      fecha_cierre: new Date(),
      asignaciones: [],
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


    const dataLog = {
      tipo:"Reserva",
      id_tipo:isSaved.id,
      accion:"Creacion",
      id_usuario:this.sesionIdUsuario

    }

    await logService.create(dataLog)
    return isSaved;
  }

  //TODAS LAS RESERVAS

  async find() {
    await Reserva.find({}).populate("asignaciones").then((result) => {
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
          return ifExist = {message:"No existe el ID de la reserva"}
        }
        return (ifExist = reserva);
      })
      .catch((err) => {
        return (ifExist = err);
      });
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
      asignaciones: changes.asignaciones,
      activo: changes.activo,
    });

    await Reserva.findByIdAndUpdate(id, newReservaInfo, { new: true })
      .then((reserva) => {
        if(!reserva){
          return isUpdate = {message:"No existe el ID de la reserva"}
        }
        return (isUpdate = reserva);
      })
      .catch((err) => {
        return (isUpdate = err);
      });

    if (isUpdate.message) {
      throw boom.badRequest(`error not exist or , ${isUpdate.message}`);
    }


    const dataLog = {
      tipo:"Reserva",
      id_tipo:isUpdate.id,
      accion:"Actualizacion",
      id_usuario:this.sesionIdUsuario
    }

    await logService.create(dataLog)

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


    const dataLog = {
      tipo:"Reserva",
      id_tipo:isDelete.id,
      accion:"Eliminar",
      id_usuario:this.sesionIdUsuario
    }

    await logService.create(dataLog)
    return {
      message: "ELiminado exitosamente",
      id,
    }

  }
}

module.exports = ReservasServices;
