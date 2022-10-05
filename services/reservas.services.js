class ReservasServices {
  constructor() {
    this.reservas = [];
    this.generate();
  }

  generate() {
    this.reservas.push({
      id: "1",
      swb: 'HLCUBO2210917366',
      destino: 'CALLAO,PERU',
    });
    this.reservas.push({
      id: "2",
      swb: 'HLCUBO2907853869',
      destino: 'SAN ANTONIO,CHILE',
    });
  }

  create(data) {
    const newReserva = {
      id:"3",
      ...data
    }
    this.reservas.push(newReserva)
    return newReserva
  }

  find() {
    return this.reservas;
  }

  findOne(id) {
    return this.reservas.find((item) => item.id === id);
  }

  update(id) {}

  delete() {}
}

module.exports = ReservasServices;
