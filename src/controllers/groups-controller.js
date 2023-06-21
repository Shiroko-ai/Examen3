var admin = require('firebase-admin');
var serviceAccount = require("../../keys/examen3-ad4d9-firebase-adminsdk-w2cxn-fa65dcd1fc.json");

function initFirebase() {
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: "https://examen3-ad4d9-default-rtdb.firebaseio.com"  
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
const getAllUsers = (req, res) => {
  let db = admin.database();
  var groupsRef = db.ref('groups');
  let allUsers = {};
  groupsRef.once('value', (snapshot) => {
      const groupsData = snapshot.val();
      if (groupsData) {

          for (let group in groupsData) {
              let users = groupsData[group].users;
              for (let user in users) {
                  allUsers[user] = {usuario: users[user], "grupo" : group};
              }
          }
          res.status(200).send(allUsers);
      } else {
          res.status(404).send("No se encontraron grupos");
      }
  }, (error) => {
      res.status(500).send("Se produjo un error al obtener los usuarios. Error: " + error);
  });
};
const deleteGroup = (req, res) => {
  let db = admin.database();
  var groupsRef = db.ref('groups');
  const groupName = req.body.groupName;
  if(!groupName) {
      res.status(400).send("Debe proporcionar un nombre de grupo para eliminar");
      return;
  }
  var groupToDeleteRef = groupsRef.child(groupName);
  groupToDeleteRef.remove()
      .then(() => {
          res.status(200).send(`El grupo ${groupName} se eliminó con éxito`);
      })
      .catch((error) => {
          res.status(500).send(`Se produjo un error al eliminar el grupo. Error: ${error}`);
      });
};

const deleteUser = (req, res) => {
  let db = admin.database();
  var groupsRef = db.ref('groups');
  const groupName = req.body.groupName;
  const userName = req.body.userName;
  if(!groupName || !userName) {
      res.status(400).send("Debe proporcionar un nombre de grupo y un nombre de usuario para eliminar");
      return;
  }
  var groupRef = groupsRef.child(groupName);

  groupRef.once('value', (snapshot) => {
      if (snapshot.exists()) {
          const groupData = snapshot.val();
          let userKeyToDelete = null;

          // Recorremos todos los usuarios del grupo
          for (let userKey in groupData.users) {
              if (groupData.users[userKey].user === userName) {
                  userKeyToDelete = userKey;
                  break;
              }
          }

          // Encontramos el usuario, procedemos a eliminarlo
          if (userKeyToDelete) {
              var userToDeleteRef = groupRef.child(`users/${userKeyToDelete}`);
              userToDeleteRef.remove()
                  .then(() => {
                      res.status(200).send(`El usuario ${userName} del grupo ${groupName} se eliminó con éxito`);
                  })
                  .catch((error) => {
                      res.status(500).send(`Se produjo un error al eliminar el usuario. Error: ${error}`);
                  });
          } else {
              res.status(404).send(`No se encontró al usuario ${userName} en el grupo ${groupName}`);
          }
      } else {
          res.status(404).send("No se encontró el grupo proporcionado");
      }
  }, (error) => {
      res.status(500).send("Se produjo un error al obtener el grupo. Error: " + error);
  });
};


const registerUser = (req, res) => {
    let params = req.body
    let TAG = params.TAG
    let user = params.user
    let password = params.password
    let group = params.group
    let db = admin.database();
    let groupRef = db.ref(`groups/${group}`);
  
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
   
  
  
module.exports = { createGroup, getGroups,registerUser,loginUser,deleteGroup,getAllUsers, deleteUser };