const controllerGroup = require('../controllers/groups-controller')
const express = require('express')

const groupRouter = express.Router()

groupRouter.post('/set-group-name',controllerGroup.createGroup);
groupRouter.post('/set-user',controllerGroup.registerUser);
groupRouter.get('/get-groups',controllerGroup.getGroups);
groupRouter.post('/delete-group',controllerGroup.deleteGroup);
groupRouter.get('/get-all-users',controllerGroup.getAllUsers);
groupRouter.post('/login',controllerGroup.loginUser);
groupRouter.post('/delete-user',controllerGroup.deleteUser);

module.exports=groupRouter;