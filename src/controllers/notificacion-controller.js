var admin = require('firebase-admin')
var serviceAcount = require("../../keys/notipush2023-89010-firebase-adminsdk-d0tcu-0fe908b7c4.json");

//La autenticacion en Firebase
function iniciaFirebase(){
    admin.initializeApp({
        credential:admin.credential.cert(serviceAcount)
    })
}

//Aqui nos autenticamos, ya que mandamos llamar la funcion
iniciaFirebase();

//Crear una funcion para enviar la notificacion - Endpoint
const enviarMensajeNotificacion = (req=request,res)=>{
    //Recuperar los datos de la notificacion
    const { titulo, mensaje, token } = req.body;
    //Construir y enviar la notificacion
    admin.messaging().send({
        token:token,
        notification:{
            "title":titulo,
            "body":mensaje
        }
    }).then((resultado)=>{
        res.send("La notificacion se mando correctamente: "+resultado);
    }).catch((error)=>{
        res.send("No se mando la notificacion: "+error);
    })
}

module.exports={enviarMensajeNotificacion};
