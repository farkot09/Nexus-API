const express = require('express');
const router = express.Router();
const ReservasServices = require('../services/reservas.services');

const service = new ReservasServices();

router.get('/', (req, res) => {
  const reservas = service.find();
  res.json(reservas);
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  const reserva = service.findOne(id);
  res.json(reserva);
});

router.post('/', (req, res) => {
  const body = req.body;
  const newReserva = service.create(body);
  res.status(201).json(newReserva)
});

router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const body = req.body;
  res.json({
    message: 'Actualizacion',
    id,
    body,
  });
});

module.exports = router;
