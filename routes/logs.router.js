const express = require('express');
const router = express.Router();
const LogsServices = require('../services/logs.services');

const service = new LogsServices();


router.get('/',async (req, res, next) => {
  try {
    const logs = await service.find();
    res.json(logs);
  } catch (error) {
    next(error)
  }
});

router.get('/:tipo', async (req, res, next) => {
  const {tipo} = req.params
  try {
    const logs = await service.findByTipe(tipo);
    res.json(logs);
  } catch (error) {
    next(error)
  }
});

router.post('/',async (req, res, next) => {
  const {body} = req
  try {
    const logs = await service.create(body);
    res.json(logs);
  } catch (error) {
    next(error)
  }
});



module.exports = router;
