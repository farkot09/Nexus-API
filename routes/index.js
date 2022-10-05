const express = require('express');
const reservasRouter = require("./reservas.router")
const clientesRouter = require("./clientes.router")

function routerApi(app){
  const router = express.Router();
  app.use("/api/v1", router)
  router.use("/reservas", reservasRouter)
  router.use("/clientes", clientesRouter)
}

module.exports = routerApi;
