const mongoose = require('mongoose');
const connectionString ="mongodb+srv://farkot09:BarceloNA26@cluster0.y5q5d79.mongodb.net/nexus?retryWrites=true&w=majority";

//conexion amongo dv

const dbconnect = mongoose
  .connect(connectionString)
  .then(() => {
    console.log('database Connected');
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = dbconnect;
