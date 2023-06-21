var admin = require('firebase-admin')
var serviceAcount = require("../../keys/examen3-ad4d9-firebase-adminsdk-w2cxn-fa65dcd1fc.json");


function iniciaFirebase(){
    admin.initializeApp({
        credential:admin.credential.cert(serviceAcount),
        databaseURL: "https://examen3-ad4d9-default-rtdb.firebaseio.com" 
    })
}

iniciaFirebase();

const enviarMensajeNotificacion = (req,res)=>{
    console.log('hola')
    
    
    const { titulo, mensaje } = req.body;
    
    const { groupName } = req.body;
    let db = admin.database();
    var groupRef = db.ref(`groups/${groupName}`);
    
    groupRef.once('value', (groupsSnapshot) => {
        const groupsData = groupsSnapshot.val();
        let usuarios = groupsData.users
        let tokens = []
        for (let key in usuarios) {
        tokens.push(usuarios[key].TAG)
        }
        if(tokens.length === 0){
            res.send("No hay usuarios en este grupo")
        }
        else{
        let mensajes = tokens.map(token => {
            return {
                token: token,
                notification:{
                    "title":titulo,
                    "body":mensaje
                }
            }
        });
    admin.messaging().sendEach(mensajes).then((resultado)=>{
        res.send("La notificacion se mando correctamente: "+resultado);
    }).catch((error)=>{
        res.send("No se mando la notificacion: "+error);
    })
    var notiRef = db.ref(`groups/${groupName}/notifications`);
    notiRef.push({
        titulo: titulo,
        mensaje: mensaje,
        createdAt: admin.database.ServerValue.TIMESTAMP
    });
    }})
    

}

const borrarNotificacion = (req, res) => {
    const { createdAt, groupName } = req.body;
    let db = admin.database();
    console.log(groupName, createdAt)
    var notiRef = db.ref(`groups/${groupName}/notifications`);

    notiRef.once('value', (snapshot) => {
        const notiData = snapshot.val();
        let notiKeyToDelete = null;
        for (let key in notiData) {
            console.log("comparacion "+notiData[key].createdAt+" real"+createdAt)
            if (notiData[key].createdAt == createdAt) {
                notiKeyToDelete = key;
                break;
            }
        }

        if (notiKeyToDelete) {
            notiRef.child(notiKeyToDelete).remove()
                .then(() => {
                    res.status(200).send("La notificación ha sido borrada correctamente.");
                })
                .catch((error) => {
                    res.status(500).send("Se produjo un error al intentar borrar la notificación. Error: " + error);
                });
        } else {
            res.status(404).send("No se encontró ninguna notificación con la marca de tiempo proporcionada.");
        }
    }, (error) => {
        res.status(500).send("Se produjo un error al obtener las notificaciones. Error: " + error);
    });
}



const obtenerNotificaciones = (req,res)=>{
    const { groupName } = req.body;
    let db = admin.database();
    console.log(groupName)
    var notiRef = db.ref(`groups/${groupName}/notifications`);
    notiRef.once('value', (snapshot) => {
        const notiData = snapshot.val();
        console.log(notiData)
        if (notiData) {
            console.log("si hay")
            res.status(200).send(notiData);
        } else {
            console.log("no hay")
            res.status(404).send("No se encontraron notificaciones");
        }
    }, (error) => {
        res.status(500).send("Se produjo un error al obtener los grupos. Error: " + error);
    });
    }
    const obtenerTodasLasNotificaciones = (req, res) => {
        let db = admin.database();
        var groupsRef = db.ref(`groups`);
        groupsRef.once('value', (snapshot) => {
            const groupsData = snapshot.val();
            const allNotifications = [];
            console.log(groupsData)
            for(let groupName in groupsData){
                const group = groupsData[groupName];
                if(group.notifications){
                    for(let notiKey in group.notifications){
                        const noti = group.notifications[notiKey];
                        allNotifications.push({noti, groupName});
                    }
                }
            }
    
            if (allNotifications.length > 0) {
                console.log("si hay")
                res.status(200).send(allNotifications);
            } else {
                console.log("no hay")
                res.status(404).send("No se encontraron notificaciones");
            }
        }, (error) => {
            res.status(500).send("Se produjo un error al obtener las notificaciones. Error: " + error);
        });
    }
    

module.exports={enviarMensajeNotificacion, obtenerNotificaciones, obtenerTodasLasNotificaciones,borrarNotificacion};
