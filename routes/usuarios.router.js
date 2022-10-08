const express = require('express');
const router = express.Router();
const UsuariosServices = require('../services/usuarios.services');

const service = new UsuariosServices();

router.get('/', async (req, res, next) => {
  try {
    const usuarios = await service.find();
    res.json(usuarios);
  } catch (error) {
    next(error)
  }
});

router.post('/', async (req, res, next) => {
  const {body} = req
  try {
    const usuario = await service.create(body);
    res.json(usuario);
  } catch (error) {
    next(error)
  }
});

router.post('/login', async (req, res, next) => {
  const {body} = req
  try {
    const usuario = await service.login(body);
    res.json(usuario);
  } catch (error) {
    next(error)
  }
});

module.exports = router;
