const nodemailer = require("nodemailer")
const Asignacion = require('../schemas/asignaciones.schema');

const createTrans = () => {
  const transport = nodemailer.createTransport({
    host:"smtp.hostinger.com",
    port:465,
    auth:{
      user:"noreply@sigicon.com",
      pass:"BarceloNA26."
    }
  })

  return transport
}

const sendMail = async (id) => {
  const data = await Asignacion.findById(id).populate("id_cliente").populate("id_reserva")

  const correo = data.id_cliente[0].correo
  const cliente = data.id_cliente[0].razon_social
  const producto = data.producto
  const cantidad = data.cantidad
  const peso = data.peso
  const destino = data.destino_final
  const agencia_aduanas = data.agencia_aduanas
  const tipo_empaque = data.tipo_empaque


  const transporter = createTrans()
  const info = await transporter.sendMail({
    from:'"MSL Informacion de Asignacion a Reserva" <noreply@sigicon.com>',
    to:correo,
    subject:"Codigo de Acceso para Carga de Documentacion",
    html:`<!DOCTYPE html>
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <meta name="x-apple-disable-message-reformatting">
      <title></title>
      <!--[if mso]>
      <style>
        table {border-collapse:collapse;border-spacing:0;border:none;margin:0;}
        div, td {padding:0;}
        div {margin:0 !important;}
      </style>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
      <![endif]-->
      <style>
        table, td, div, h1, p {
          font-family: Arial, sans-serif;
        }
        @media screen and (max-width: 530px) {
          .unsub {
            display: block;
            padding: 8px;
            margin-top: 14px;
            border-radius: 6px;
            background-color: #555555;
            text-decoration: none !important;
            font-weight: bold;
          }
          .col-lge {
            max-width: 100% !important;
          }
        }
        @media screen and (min-width: 531px) {
          .col-sml {
            max-width: 27% !important;
          }
          .col-lge {
            max-width: 73% !important;
          }
        }
      </style>
    </head>
    <body style="margin:0;padding:0;word-spacing:normal;background-color:#939297;">
      <div role="article" aria-roledescription="email" lang="en" style="text-size-adjust:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;background-color:#939297;">
        <table role="presentation" style="width:100%;border:none;border-spacing:0;">
          <tr>
            <td align="center" style="padding:0;">
              <!--[if mso]>
              <table role="presentation" align="center" style="width:600px;">
              <tr>
              <td>
              <![endif]-->
              <table role="presentation" style="width:94%;max-width:600px;border:none;border-spacing:0;text-align:left;font-family:Arial,sans-serif;font-size:16px;line-height:22px;color:#363636;">
                <tr>
                  <td style="padding:40px 30px 30px 30px;text-align:center;font-size:24px;font-weight:bold;">
                    <a href="http://logitrav.com/NEXUS/dashboard/inicioCliente.html" style="text-decoration:none;"><img src="https://sigicon.com/gallery_gen/202c13f34531e9fbc07500d95da0c53f_80x80.png" width="165" alt="Logo" style="width:165px;max-width:80%;height:auto;border:none;text-decoration:none;color:#ffffff;"></a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:30px;background-color:#ffffff;">
                    <h1 style="margin-top:0;margin-bottom:16px;font-size:26px;line-height:32px;font-weight:bold;letter-spacing:-0.02em;">Hola ${cliente}</h1>
                    <p style="margin:0;">Se acaba de asignar tu carga a una Reserva para la siguiente Carga, carga tus documentos de manera oportuna, antes del cierre del booking</p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:35px 30px 11px 30px;font-size:0;background-color:#ffffff;border-bottom:1px solid #f0f0f5;border-color:rgba(201,201,207,.35);">
                    <!--[if mso]>
                    <table role="presentation" width="100%">
                    <tr>
                    <td style="width:145px;" align="left" valign="top">
                    <![endif]-->

                    <!--[if mso]>
                    </td>
                    <td style="width:395px;padding-bottom:20px;" valign="top">
                    <![endif]-->
                    <div class="col-lge" style="display:inline-block;width:100%;max-width:395px;vertical-align:top;padding-bottom:20px;font-family:Arial,sans-serif;font-size:16px;line-height:22px;color:#363636;">
                      <p style="margin-top:0;margin-bottom:12px;">Producto: ${producto}</p>
                      <p style="margin-top:0;margin-bottom:12px;">Cantidad: ${cantidad} ${tipo_empaque}</p>
                      <p style="margin-top:0;margin-bottom:12px;">Peso: ${peso}</p>
                      <p style="margin-top:0;margin-bottom:12px;">Destino: ${destino}</p>
                      <p style="margin-top:0;margin-bottom:12px;">Agencia de Aduanas: ${agencia_aduanas}</p>
                      <p style="margin-top:0;margin-bottom:18px;">tu codigo para la carga de los documentos es: <h2>${id}</h2> no olvides digitar correctamente el numero del NIT </p>
                      <p style="margin:0;"><a href="http://logitrav.com/NEXUS/dashboard/inicioCliente.html#" style="background: #0c457a; text-decoration: none; padding: 10px 25px; color: #ffffff; border-radius: 4px; display:inline-block; mso-padding-alt:0;text-underline-color:#ff3884"><!--[if mso]><i style="letter-spacing: 25px;mso-font-width:-100%;mso-text-raise:20pt">&nbsp;</i><![endif]--><span style="mso-text-raise:10pt;font-weight:bold;">Cargar Documentacion</span><!--[if mso]><i style="letter-spacing: 25px;mso-font-width:-100%">&nbsp;</i><![endif]--></a></p>
                    </div>
                    <!--[if mso]>
                    </td>
                    </tr>
                    </table>
                    <![endif]-->
                  </td>
                </tr>
                <tr>
                  <td style="padding:30px;text-align:center;font-size:12px;background-color:#404040;color:#cccccc;">
                    <p style="margin:0 0 8px 0;"><a href="http://www.facebook.com/" style="text-decoration:none;"><img src="https://assets.codepen.io/210284/facebook_1.png" width="40" height="40" alt="f" style="display:inline-block;color:#cccccc;"></a> <a href="http://www.twitter.com/" style="text-decoration:none;"><img src="https://assets.codepen.io/210284/twitter_1.png" width="40" height="40" alt="t" style="display:inline-block;color:#cccccc;"></a></p>
                    <p style="margin:0;font-size:14px;line-height:20px;">&reg; Someone, Somewhere 2021<br><a class="unsub" href="http://www.example.com/" style="color:#cccccc;text-decoration:underline;">Unsubscribe instantly</a></p>
                  </td>
                </tr>
              </table>
              <!--[if mso]>
              </td>
              </tr>
              </table>
              <![endif]-->
            </td>
          </tr>
        </table>
      </div>
    </body>
    </html>`
  })

  console.log("Message Send", info.messageId);

  return

}

module.exports = sendMail
