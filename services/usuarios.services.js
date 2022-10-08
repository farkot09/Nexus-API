require('../database/mongoConnect');
const boom = require('@hapi/boom');
const Usuario = require('../schemas/usuarios.schema');

class UsuariosServices {
  async find() {
    let data = {};
    await Usuario.find({}).then((usuarios) => {
      return (data = usuarios);
    });
    return data;
  }

  async create(data) {
    let isSaved = {};
    const { correo, nombre, telefono, password,rol, activo } = data;

    const newUsuario = new Usuario({
      correo,
      nombre,
      telefono,
      activo,
      password,
      rol,
      fecha: new Date(),
    });

    await newUsuario
      .save()
      .then((savedUsuario) => {
        return (isSaved = savedUsuario);
      })
      .catch((err) => {
        return (isSaved = err);
      });

    if (isSaved.errors) {
      throw boom.notFound(`no se pudo crear el usuario, ${isSaved._message}`);
    }
    return isSaved;
  }

  async login(data) {
    let ifExist = {};
    const { correo, password } = data;
    await Usuario.find({ correo, password })
      .then((usuario) => {
        if (!usuario) {
          return (ifExist = { message: 'Datos incorrectos' });
        }

        return (ifExist = usuario);
      })
      .catch((err) => {
        return (ifExist = err);
      });

    if (ifExist.message || ifExist.length === 0) {
      throw boom.notFound(`Not exist or, ${ifExist.message}`);
    }

    return ifExist;
  }
}

module.exports = UsuariosServices;
