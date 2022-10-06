const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;
const routerApi = require('./routes');
const {
  logErrors,
  errorHandler,
  boomErrorHandler,
} = require('./middlewares/errorHandler');

app.use(express.json());

// inicio configuracion de acceso CORS
const whiteList = ['http://localhost:3000', 'http://myapp.com'];
const options = {
  origin: (origin, callback) => {
    if (whiteList.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido'));
    }
  },
};
app.use(cors(options));

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
