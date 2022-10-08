const nodemailer = require("nodemailer")

const createTrans = () => {
  const transport = nodemailer.createTransport({
    host:"smtp.hostinger.com",
    port:465,
    auth:{
      user:"info@sigicon.com",
      pass:"BarceloNA26."
    }
  })

  return transport
}

const sendMail = async (data) => {
  const transporter = createTrans()
  const info = await transporter.sendMail({
    from:'"MSL Informacion de Asignacion a Reserva" <info@sigicon.com>',
    to:"viagramo2011@gmail.com",
    subject:"Codigo de Acceso para Carga de Documentacion",
    html:`<h1>Hola este es tu codigo de acceso para cargar los documentos ${data.id}</h1>`
  })

  console.log("Message Send", info.messageId);

  return

}

module.exports = sendMail
