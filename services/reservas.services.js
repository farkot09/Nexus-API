const boom = require('@hapi/boom');

class ReservasServices {
  constructor() {
    this.reservas = [];
    this.generate();
  }

  async generate() {
    this.reservas.push({
      id: '1',
      swb: 'HLCUBO2210917366',
      destino: 'CALLAO,PERU',
    });
    this.reservas.push({
      id: '2',
      swb: 'HLCUBO2907853869',
      destino: 'SAN ANTONIO,CHILE',
    });
  }

  async create(data) {
    const newReserva = {
      id: '3',
      ...data,
    };
    this.reservas.push(newReserva);
    return newReserva;
  }

  async find() {
    return this.reservas;
  }

  async findOne(id) {
    const reserva = this.reservas.find((item) => item.id === id);
    if (!reserva) {
      throw boom.notFound('reserva not existe');
    }
    return reserva;
  }

  async update(id, changes) {
    const index = this.reservas.findIndex((item) => item.id === id);
    if (index === -1) {
      throw boom.notFound('reserva not found');
    }
    const reserva = this.reservas[index];
    this.reservas[index] = {
      ...reserva,
      ...changes,
    };
    return this.reservas[index];
  }

  async delete() {}
}

module.exports = ReservasServices;
