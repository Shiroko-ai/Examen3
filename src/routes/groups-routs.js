const controllerGroup = require('../controllers/groups-controller')
const express = require('express')

const groupRouter = express.Router()

groupRouter.post('/set-group-name',controllerGroup.createGroup);
groupRouter.post('/set-user',controllerGroup.registerUser);
groupRouter.get('/get-groups',controllerGroup.getGroups);
groupRouter.post('/delete-group',controllerGroup.deleteGroup);
groupRouter.post('/login',controllerGroup.loginUser);

module.exports=groupRouter;