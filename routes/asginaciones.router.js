const express = require("express")
const router = express.Router();
const AsignacionesServices = require("../services/asignaciones.services")

const service = new AsignacionesServices();

router.post('/subirDocumentos/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const newDocumentation = await service.uploadDocumentation(id, body);
    res.status(201).json(newDocumentation);
  } catch (error) {
    next(error);
  }
});

router.post("/cambiarEstado/:id", async (req,res, next) => {
  try {
    const {id} = req.params
    const body = req.body;
    const newStatus = await service.changeStatusDocument(id,body)
    res.status(201).json(newStatus);
  } catch (error) {
    next(error)
  }
})


router.post("/", async (req,res, next) => {
  try {
    const body = req.body;
    const newAsignacion = await service.create(body)
    res.status(201).json(newAsignacion);
  } catch (error) {
    next(error)
  }
})



router.get("/", async (req, res) => {
  const asignaciones = await service.find();
  res.json(asignaciones)
})

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const asignacion = await service.findOne(id);
    res.json(asignacion);
  } catch (error) {
    next(error);
  }
})

router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const updateAsignacion = await service.update(id, body);
    res.json(updateAsignacion);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleteAsignacion = await service.delete(id);
    res.json(deleteAsignacion);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
