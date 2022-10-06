require("dotenv").config()
require("./database/mongoConnect")
const express = require('express');
const app = express();
//const cors = require('cors');
const port = process.env.PORT ;
const routerApi = require('./routes');
const {
  logErrors,
  errorHandler,
  boomErrorHandler,
} = require('./middlewares/errorHandler');


app.use(express.json());

// inicio configuracion de acceso CORS

//app.use(cors);

// FIN configuracion de acceso CORS

app.get('/', (req, res) => {
  res.send('Hola my server en Express');
});

routerApi(app);
app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);

app.listen(port);
console.log('Server is running in POrt', port);
