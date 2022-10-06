require('../database/mongoConnect');
const boom = require('@hapi/boom');
const Cliente = require('../schemas/clientes.schema');

class ClientesServices {
  constructor() {
    this.clientes = [];
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
      nit,
      razon_social,
      correo,
      telefono,
      nombre_contacto,
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

  async update(id, changes){

  }

}

module.exports = ClientesServices;
