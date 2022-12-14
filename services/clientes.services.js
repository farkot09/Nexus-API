require('../database/mongoConnect');
const boom = require('@hapi/boom');
const Cliente = require('../schemas/clientes.schema');
const Asignacion = require('../schemas/asignaciones.schema');
const LogsServices = require('../services/logs.services');

const logService = new LogsServices();

class ClientesServices {
  constructor() {
    this.clientes = [];
    this.sesionIdUsuario = 'Sin Registrar';
  }

  //CREAR CLIENTE

  async create(data) {
    const {
      nit,
      razon_social,
      correo,
      telefono,
      nombre_contacto,
      fecha_creacion,
      activo,
    } = data;
    const newCliente = new Cliente({
      nit: nit.toUpperCase().trim(),
      razon_social: razon_social,
      correo: correo.trim(),
      telefono: telefono.toUpperCase().trim(),
      nombre_contacto: nombre_contacto.toUpperCase().trim(),
      fecha_creacion,
      activo,
    });

    let isSaved = {};

    await newCliente
      .save()
      .then((savedCliente) => {
        return (isSaved = savedCliente);
      })
      .catch((err) => {
        return (isSaved = err);
      });

    if (isSaved.errors) {
      throw boom.notFound(`Cliente Not Created, ${isSaved._message}`);
    }

    const dataLog = {
      tipo: 'Clientes',
      id_tipo: isSaved.id,
      accion: 'Creacion',
      id_usuario: this.sesionIdUsuario,
    };

    await logService.create(dataLog);

    return isSaved;
  }

  // TODOS LOS CLIENTES

  async find() {
    await Cliente.find({}).then((result) => {
      this.clientes = result;
    });

    return this.clientes;
  }

  //ENCONTRAR UN CLIENTE

  async findOne(id) {
    let ifExist = {};
    await Cliente.findById(id)
      .then((cliente) => {
        if (!cliente) {
          return (ifExist = { message: 'No existe el id' });
        }
        return (ifExist = cliente);
      })
      .catch((err) => {
        return (ifExist = err);
      });
    if (ifExist.message) {
      throw boom.badRequest(`error, invalid id, ${ifExist.message}`);
    }
    return ifExist;
  }

  async findOnebyNit(nit) {
    let ifExist = {};
    await Cliente.find({nit})
      .then((cliente) => {
        if (!cliente) {
          return (ifExist = { message: 'No existe el nit' });
        }
        return (ifExist = cliente);
      })
      .catch((err) => {
        return (ifExist = err);
      });
    if (ifExist.message) {
      throw boom.badRequest(`error, invalid nit, ${ifExist.message}`);
    }
    return ifExist;
  }

  async update(id, changes) {
    let isUpdate = {};
    const newClienteInfo = new Cliente({
      _id: id,
      nit: changes.nit.toUpperCase().trim(),
      razon_social: changes.razon_social.toUpperCase().trim(),
      correo: changes.correo.trim(),
      telefono: changes.telefono.toUpperCase().trim(),
      nombre_contacto: changes.nombre_contacto.toUpperCase().trim(),
      fecha_creacion: changes.fecha_creacion,
      activo: changes.activo,
    });

    await Cliente.findByIdAndUpdate(id, newClienteInfo, { new: true })
      .then((cliente) => {
        if (!cliente) {
          return (isUpdate = { message: 'No existe el Id' });
        }
        return (isUpdate = cliente);
      })
      .catch((err) => {
        return (isUpdate = err);
      });
    if (isUpdate.message) {
      throw boom.badRequest(`error, not exist or, ${isUpdate.message}`);
    }

    const dataLog = {
      tipo: 'Clientes',
      id_tipo: isUpdate.id,
      accion: 'Actualizacion',
      id_usuario: this.sesionIdUsuario,
    };

    await logService.create(dataLog);

    return isUpdate;
  }

  async delete(id) {
    let isDelete = {};
    await Cliente.findByIdAndRemove(id)
      .then((cliente) => {
        if (!cliente) {
          return (isDelete = { message: 'Noe existe el Id' });
        }
        return (isDelete = cliente);
      })
      .catch((err) => {
        return (isDelete = err);
      });
    if (isDelete.message) {
      throw boom.badRequest(`error, not exist or, ${isDelete.message}`);
    }

    const dataLog = {
      tipo: 'Clientes',
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
  async findAsignations(id_cliente) {
    let ifExist = {};
    await Asignacion.find({ id_cliente })
      .then((asignaciones) => {
        if (!asignaciones[0]) {
          return (ifExist = {
            message: 'No existe el ID del cliente, o no tiene asignaciones',
          });
        }
        return (ifExist = asignaciones);
      })
      .catch((err) => {
        ifExist = err;
      });

    if (ifExist.message) {
      throw boom.badRequest(`Not exist or ${ifExist.message}`);
    }

    return ifExist;
  }

  async findAsignationsForDocumentation(data) {
    let ifExist = {};
    const { id, nit } = data;
    await Asignacion.findById(id)
      .populate('id_cliente', {
        nit: 1,
        razon_social: 1,
        _id: 0,
      })
      .populate('id_reserva', {
        numero_reserva: 1,
        fecha_cierre: 1,
        destino: 1,
        _id: 0,
      })
      .then((asignacion) => {
        if (!asignacion) {
          return (ifExist = { message: 'No existe el ID en las asignaciones' });
        }

        if (asignacion.id_cliente[0].nit != nit) {
          return (ifExist = { message: 'No coincide el numero de NIT' });
        }

        return (ifExist = asignacion);
      })
      .catch((err) => {
        return (ifExist = err);
      });

    if (ifExist.message) {
      throw boom.badRequest(`Not exist or, ${ifExist.message}`);
    }

    return ifExist;
  }
}

module.exports = ClientesServices;
