const boom = require("@hapi/boom")

class ClientesServices {
  constructor() {
    this.clientes = [];
    this.generate();
  }

  async generate() {
    this.clientes.push({
      id: '1',
      cliente: 'ENCO EXPRES',
      producto: 'ABONO PARA TIERRA',
    });
    this.clientes.push({
      id: '2',
      cliente: 'SAAT ANDINA',
      producto: 'LAMBADA 1 LITRO',
    });
  }

  async find() {
    return this.clientes;
  }

  async findOne(id) {
    const cliente = this.clientes.find((item) => item.id === id);
    if(!cliente){
      throw boom.notFound("cliente no existe")
    }
    return cliente
  }
}

module.exports = ClientesServices;
