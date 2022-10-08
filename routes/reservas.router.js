const express = require('express');
const router = express.Router();
const ReservasServices = require('../services/reservas.services');

const service = new ReservasServices();

router.get('/', async (req, res) => {
  const reservas = await service.find()
  res.json(reservas);
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const reserva = await service.findOne(id);
    res.json(reserva);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const body = req.body;
    const newReserva = await service.create(body);
    res.status(201).json(newReserva);
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const updateReserva = await service.update(id, body);
    res.json(updateReserva);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleteReserva = await service.delete(id);
    res.json(deleteReserva);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
