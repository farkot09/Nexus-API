require('../database/mongoConnect');
const boom = require('@hapi/boom');
const Asignacion = require('../schemas/asignaciones.schema');
const ReservasServices = require('../services/reservas.services');
const ClientesServices = require('../services/clientes.services');
const sendMail = require('../database/emailer');



const Reservaservice = new ReservasServices();
const Clienteservice = new ClientesServices();
class AsignacionesServices {
  constructor() {
    this.asignaciones = [];
  }

  //CREAR ASIGNACION

  async create(data) {
    const {
      roe,
      booking,
      modalidad,
      cantidad,
      tipo_empaque,
      peso,
      cubicaje,
      producto,
      destino_final,
      medidas,
      agencia_aduanas,
      //fecha_creacion,
      activo,
      id_reserva,
      id_cliente,
    } = data;

    let isSaved = {};
    const reserva = await Reservaservice.findOne(id_reserva);
    const cliente = await Clienteservice.findOne(id_cliente);
    if (reserva && cliente) {
      const newAsignacion = new Asignacion({
        roe,
        booking,
        modalidad,
        cantidad,
        tipo_empaque,
        peso,
        cubicaje,
        producto,
        destino_final,
        medidas,
        agencia_aduanas,
        fecha_creacion: new Date(),
        activo,
        id_reserva,
        id_cliente: cliente._id,
      });

      await newAsignacion
        .save()
        .then((savedAsignacion) => {
          reserva.asignaciones.push(savedAsignacion._id);
          Reservaservice.update(reserva.id, reserva);
          sendMail(savedAsignacion._id)
          return (isSaved = savedAsignacion);
        })
        .catch((err) => {
          return (isSaved = err);
        });

      if (isSaved.errors) {
        throw boom.notFound(`error de asignacion, ${isSaved._message}`);
      }
      return isSaved;
    } else {
      isSaved = { errors: 404, message: 'no existe el id' };
    }

    if (isSaved.errors) {
      throw boom.notFound(`Error al asignar,${isSaved.message}`);
    }


    return isSaved;
  }
  //TODAS LAS ASIGNACIONES

  async find() {
    await Asignacion.find({})
      .populate('id_cliente')
      .then((result) => {
        this.asignaciones = result;
      });
    return this.asignaciones;
  }

  async findOne(id) {
    let isExist = {};
    await Asignacion.findById(id)
      .populate('id_cliente')
      .then((asignacion) => {
        if (!asignacion) {
          return (isExist = { message: 'No existe el ID de la asignacion' });
        }
        return (isExist = asignacion);
      })
      .catch((err) => {
        return (isExist = err);
      });
    if (isExist.message) {
      throw boom.badRequest(`Error, invalid id, ${isExist.message}`);
    }
    return isExist;
  }

  async update(id, changes) {
    let isUpdate = {};
    const newAsignacion = new Asignacion({
      _id: id,
      roe: changes.roe,
      booking: changes.booking,
      modalidad: changes.modalidad,
      cantidad: changes.cantidad,
      tipo_empaque: changes.tipo_empaque,
      peso: changes.peso,
      cubicaje: changes.cubicaje,
      producto: changes.producto,
      destino_final: changes.destino_final,
      medidas: changes.medidas,
      agencia_aduanas: changes.agencia_aduanas,
      fecha_creacion: changes.fecha_creacion,
      activo: changes.activo,
      id_reserva: changes.id_reserva,
      id_cliente: changes.id_cliente,
    });

    await Asignacion.findByIdAndUpdate(id, newAsignacion, { new: true })
      .then((asignacion) => {
        if (!asignacion) {
          return (isUpdate = { message: 'No existe el ID de la asignacion' });
        }
        return (isUpdate = asignacion);
      })
      .catch((err) => {
        return (isUpdate = err);
      });
    if (isUpdate.message) {
      throw boom.badRequest(`Error not exist or, ${isUpdate.message}`);
    }
    return isUpdate;
  }

  async delete(id) {
    let isDelete = {};
    await Asignacion.findByIdAndRemove(id)
      .then((asiganacion) => {
        if (!asiganacion) {
          return (isDelete = { message: 'No existe el ID de la asignacion' });
        }

        return (isDelete = asiganacion);
      })
      .catch((err) => {
        isDelete = err;
      });
    if (isDelete.message) {
      throw boom.badRequest(`Error, not exist or, ${isDelete.message}`);
    }

    return {
      message: 'Eliminado Exitosamente',
      id,
    };
  }

  async uploadDocumentation(id, data) {
    let isUpload = {};
    const { tipo_documento, url, estado } = data;
    const newDocu = {
      tipo_documento,
      url,
      estado,
      observacion: 'Sin Observaciones',
      fecha: new Date(),
    };
    await Asignacion.findById(id)
      .then((asignacion) => {
        if (!asignacion) {
          return (isUpload = { message: 'No existe el ID de la asignacion' });
        }
        asignacion.documentacion.push(newDocu);

        return (isUpload = asignacion);
      })
      .catch((err) => {
        return (isUpload = err);
      });

    if (isUpload.message) {
      throw boom.badRequest(`Error invalid id, ${isUpload.message}`);
    }

    await Asignacion.findByIdAndUpdate(isUpload._id, isUpload, { new: true })
      .then((asignacion) => {
        if (!asignacion) {
          return (isUpload = {
            message: 'No se pudo actualizar la asignacion',
          });
        }

        return (isUpload = asignacion);
      })
      .catch((err) => {
        return (isUpload = err);
      });

    return isUpload;
  }
}

module.exports = AsignacionesServices;
