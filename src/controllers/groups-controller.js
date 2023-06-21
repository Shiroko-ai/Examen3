var admin = require('firebase-admin');
var serviceAccount = require("../../keys/examen3-ad4d9-firebase-adminsdk-w2cxn-fa65dcd1fc.json");

// Initialize Firebase
function initFirebase() {
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: "https://examen3-ad4d9-default-rtdb.firebaseio.com"  // replace this with your Firebase RTDB URL
        });
    }
}

initFirebase();

const createGroup = (req, res) => {
    
    const { groupName } = req.body;
    let db = admin.database();
    var groupRef = db.ref(`groups/${groupName}`);
    groupRef.set({
        groupName: groupName,
        createdAt: admin.database.ServerValue.TIMESTAMP
    }, (error) => {
        if (error) {
            res.send("El grupo no se pudo guardar" + error);
        } else {
            res.send("Grupo guardado satisfactoriamente");
        }
    });
}

const getGroups = (req, res) => {
    let db = admin.database();
    var groupsRef = db.ref('groups');
    console.log("entre")
    groupsRef.once('value', (snapshot) => {
        const groupsData = snapshot.val();
        if (groupsData) {
            res.status(200).send(groupsData);
        } else {
            res.status(404).send("No se encontraron grupos");
        }
    }, (error) => {
        res.status(500).send("Se produjo un error al obtener los grupos. Error: " + error);
    });
};
const deleteGroup = (req, res) => {
  let db = admin.database();
  var groupsRef = db.ref('groups');

  // Recibir el nombre del grupo a eliminar
  const groupName = req.body.groupName;
  if(!groupName) {
      res.status(400).send("Debe proporcionar un nombre de grupo para eliminar");
      return;
  }

  // Encontrar el grupo con el nombre proporcionado
  var groupToDeleteRef = groupsRef.child(groupName);

  // Eliminar el grupo
  groupToDeleteRef.remove()
      .then(() => {
          res.status(200).send(`El grupo ${groupName} se eliminó con éxito`);
      })
      .catch((error) => {
          res.status(500).send(`Se produjo un error al eliminar el grupo. Error: ${error}`);
      });
};

const registerUser = (req, res) => {
    let params = req.body
    let TAG = params.TAG
    let user = params.user
    let password = params.password
    let group = params.group
    let db = admin.database();
    // Crear una referencia a la base de datos RTD
    let groupRef = db.ref(`groups/${group}`);
  
    // Verificar si el grupo existe
    groupRef.once('value', (snapshot) => {
      if (snapshot.exists()) {
        let userData = {
          TAG: TAG,
          user: user,
          password: password
        };
  
        // Crear una referencia al grupo de usuarios y agregar el nuevo usuario
        let userRef = groupRef.child('users');
        userRef.push(userData, (error) => {
          if (error) {
            res.status(500).send({ error: 'Hubo un error al insertar el usuario en la base de datos.' });
          } else {
            res.status(200).send({ success: 'Usuario insertado con éxito.' });
          }
        });
      } else {
        res.status(404).send({ error: 'Grupo no encontrado.' });
      }
    });
  }
  const loginUser = (req, res) => {
    let params = req.body;
    let user = params.user;
    let password = params.password;
    let db = admin.database();
    let groupsRef = db.ref('groups');
    let userFound = false;
    
    groupsRef.once('value', (groupsSnapshot) => {
      if (groupsSnapshot.exists()) {
        groupsSnapshot.forEach((groupSnapshot) => {
          if (groupSnapshot.hasChild('users')) {
            let usersRef = groupSnapshot.child('users');
            let jsonRefUsers = usersRef.toJSON();
            
            // Iterate over users in group
            for (let key in jsonRefUsers) {
              if (jsonRefUsers.hasOwnProperty(key)) {
                let currentUser = jsonRefUsers[key];
                if (currentUser.user === user && currentUser.password === password) {
                  res.status(200).send({"response": groupSnapshot.key});
                  console.log(groupSnapshot.key)
                  userFound = true;
                  return;
                }
              }
            }
          }
        });
        if (!userFound) {
          res.status(401).send({ error: 'Usuario o contraseña incorrectos.' });
        }
      }
    });
  }
   
  
  
module.exports = { createGroup, getGroups,registerUser,loginUser,deleteGroup };