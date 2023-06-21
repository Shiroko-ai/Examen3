const controllerNotificacion = require('../controllers/notificacion-controller')
const express = require('express')

const notificationRouter = express.Router()

notificationRouter.post('/enviar-notificacion',controllerNotificacion.enviarMensajeNotificacion);
notificationRouter.post('/get-notifications',controllerNotificacion.obtenerNotificaciones);
notificationRouter.get('/get-all-notifications',controllerNotificacion.obtenerTodasLasNotificaciones);
notificationRouter.post('/delete-notification',controllerNotificacion.borrarNotificacion);

module.exports=notificationRouter;