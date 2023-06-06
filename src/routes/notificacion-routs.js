const controllerNotificacion = require('../controllers/notificacion-controller')
const express = require('express')

const router = express.Router()

router.post('/enviar-notificacion',controllerNotificacion.enviarMensajeNotificacion);

module.exports=router;