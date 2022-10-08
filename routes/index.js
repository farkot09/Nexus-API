const express = require('express');
const reservasRouter = require("./reservas.router")
const clientesRouter = require("./clientes.router")
const asignacionesRouter = require("./asginaciones.router")
const logsRouter = require("./logs.router")
const usuariosRouter = require("./usuarios.router")

function routerApi(app){
  const router = express.Router();
  app.use("/api/v1", router)
  router.use("/reservas", reservasRouter)
  router.use("/clientes", clientesRouter)
  router.use("/asignaciones", asignacionesRouter)
  router.use("/logs", logsRouter)
  router.use("/usuarios", usuariosRouter)
}

module.exports = routerApi;
