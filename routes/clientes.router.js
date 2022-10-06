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
module.exports = router;
