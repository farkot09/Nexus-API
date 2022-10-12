require('../database/mongoConnect');
const boom = require('@hapi/boom');
const Asignacion = require('../schemas/asignaciones.schema');
const ReservasServices = require('../services/reservas.services');
const ClientesServices = require('../services/clientes.services');
const LogsServices = require('../services/logs.services');
const sendMail = require('../database/emailer');
const fs = require('fs');

const Reservaservice = new ReservasServices();
const Clienteservice = new ClientesServices();
const logService = new LogsServices();
class AsignacionesServices {
  constructor() {
    this.asignaciones = [];
    this.sesionIdUsuario = 'Sin Registrar';
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
      fecha_creacion,
      activo,
      id_reserva,
      id_cliente,
    } = data;

    let isSaved = {};
    const reserva = await Reservaservice.findOne(id_reserva);
    const cliente = await Clienteservice.findOne(id_cliente);
    if (reserva && cliente) {
      const newAsignacion = new Asignacion({
        roe: roe.toUpperCase().trim(),
        booking: booking.toUpperCase().trim(),
        modalidad,
        cantidad,
        tipo_empaque: tipo_empaque.toUpperCase().trim(),
        peso,
        cubicaje,
        producto: producto.toUpperCase().trim(),
        destino_final: destino_final.toUpperCase().trim(),
        medidas: medidas.toUpperCase().trim(),
        agencia_aduanas: agencia_aduanas.toUpperCase().trim(),
        fecha_creacion: fecha_creacion,
        activo,
        id_reserva,
        id_cliente: cliente._id,
      });

      await newAsignacion
        .save()
        .then((savedAsignacion) => {
          reserva.asignaciones.push(savedAsignacion._id);
          Reservaservice.update(reserva.id, reserva);
          //sendMail(savedAsignacion._id);
          return (isSaved = savedAsignacion);
        })
        .catch((err) => {
          return (isSaved = err);
        });

      if (isSaved.errors) {
        throw boom.notFound(`error de asignacion, ${isSaved._message}`);
      }

      const dataLog = {
        tipo: 'Asignacion',
        id_tipo: isSaved.id,
        accion: 'Creacion',
        id_usuario: this.sesionIdUsuario,
      };

      await logService.create(dataLog);
      fs.mkdir(`upload/${isSaved.id}`, (err) => {
        if (err) console.log('Error al crear Directorio');
      });
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
      roe: changes.roe.toUpperCase().trim(),
      booking: changes.booking.toUpperCase().trim(),
      modalidad: changes.modalidad,
      cantidad: changes.cantidad,
      tipo_empaque: changes.tipo_empaque.toUpperCase().trim(),
      peso: changes.peso,
      cubicaje: changes.cubicaje,
      producto: changes.producto.toUpperCase().trim(),
      destino_final: changes.destino_final.toUpperCase().trim(),
      medidas: changes.medidas.toUpperCase().trim(),
      agencia_aduanas: changes.agencia_aduanas.toUpperCase().trim(),
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
    const dataLog = {
      tipo: 'Asignacion',
      id_tipo: isUpdate.id,
      accion: 'Actualizacion',
      id_usuario: this.sesionIdUsuario,
    };

    await logService.create(dataLog);

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
    const dataLog = {
      tipo: 'Asignacion',
      id_tipo: isDelete.id,
      accion: 'Eliminar',
      id_usuario: this.sesionIdUsuario,
    };

    await logService.create(dataLog);

    return {
      message: 'Eliminado Exitosamente',
      id,
    };
  }

  async uploadDocumentation(id, data, nombreArchivo) {
    const { tipo_documento, estado } = data;
    let isUpload = {};
    const ruta = `upload/${nombreArchivo}`;
    const nuevoNombre = `upload/${id}/${tipo_documento}.pdf`;

    if (fs.existsSync(ruta)) {
      fs.rename(ruta, ruta.replace(ruta, nuevoNombre), (err) => {
        if (err) throw boom.badRequest('Error al subir archivos');
      });
    } else {
      throw boom.badRequest('Error al subir archivos');
    }

    const newDocu = {
      tipo_documento,
      url: `/upload/${id}/${tipo_documento}.pdf`.split(' ').join(''),
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

    const dataLog = {
      tipo: 'Asignacion',
      id_tipo: isUpload.id,
      accion: 'Carga Documentos',
      d_usuario: this.sesionIdUsuario,
    };

    await logService.create(dataLog);

    return isUpload;
  }

  async changeStatusDocument(id, data) {
    let isUpdate = {};
    const { tipo_documento, observacion, estado } = data;
    await Asignacion.findById(id)
      .then((asignacion) => {
        if (!asignacion) {
          return (isUpdate = { message: 'No existe el ID en la asignacion' });
        }

        const index = asignacion.documentacion.findIndex(
          (item) => item.tipo_documento === tipo_documento
        );
        const newData = {
          ...asignacion.documentacion[index],
          estado,
          observacion,
        };
        asignacion.documentacion[index] = newData;

        return (isUpdate = asignacion);
      })
      .catch((err) => {
        return (isUpdate = err);
      });

    await Asignacion.findByIdAndUpdate(id, isUpdate, { new: true })
      .then((asignacion) => {
        if (!asignacion) {
          return (isUpdate = {
            message: 'No existe el ID a Actualizar, no es posible',
          });
        }

        return (isUpdate = asignacion);
      })
      .catch((err) => {
        return (isUpdate = err);
      });

    if (isUpdate.message) {
      throw boom.badRequest(`Error, not exist or, ${isUpdate.message}`);
    }

    const dataLog = {
      tipo: 'Asignacion',
      id_tipo: isUpdate.id,
      accion: 'Actualizacion Documentos',
      d_usuario: this.sesionIdUsuario,
    };

    await logService.create(dataLog);

    return isUpdate;
  }
}

module.exports = AsignacionesServices;
