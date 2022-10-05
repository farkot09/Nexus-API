const express = require('express');
const router = express.Router();
const ClientesServices = require("../services/clientes.services");

const service = new ClientesServices;

router.get('/', (req, res) => {
  const clientes = service.find();
  res.json(clientes);

});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  const cliente = service.findOne(id);
  res.json(cliente)
});


module.exports = router;
