class ClientesServices {
  constructor() {
    this.clientes = [];
    this.generate();
  }

  generate() {
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

  find() {
    return this.clientes;
  }

  findOne(id) {
    return this.clientes.find((item) => item.id === id);
  }
}

module.exports = ClientesServices;
