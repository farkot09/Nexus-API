const express = require('express');
const router = express.Router();
const ClientesServices = require('../services/clientes.services');

const service = new ClientesServices();

router.get('/', async (req, res, next) => {
  try {
    const clientes = await service.find();
    res.json(clientes);
  } catch (error) {
    next(error)
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const cliente = await service.findOne(id);
    res.json(cliente);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next)=>{
  try {
    const body = req.body;
    const newCliente = await service.create(body)
    res.status(201).json(newCliente);
  } catch (error) {
    next(error)
  }
})

router.patch("/:id", async (req, res, next) => {
  try {
    const {id} = req.params;
    const body = req.body;
    const updateCliente = await service.update(id, body)
    res.json(updateCliente)
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleteCliente = await service.delete(id);
    res.json(deleteCliente);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
