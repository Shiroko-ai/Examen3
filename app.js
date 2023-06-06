//Para crear la aplicacion como servidor
const express   = require('express');
const cors      = require('cors');
const bodyParser= require('body-parser')
const puerto    = process.env.PORT || 3000;

const router    = require('./src/routes/notificacion-routs')

//Nuestra constante se comporte de tal forma que pueda procesar
//Solicitudes de GET, POST, PUT, DELETE, etc
const app = express();

//Especificar quien renderiza las vistas dinamicas
app.set('view engine','hbs');

//Indicar donde se encuentra el directorio publico y estatico
app.use(express.static('public'))
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//Uso la ruta que define en el router y que la procesa el controlador
app.use(router);

//Respoder solicitudes en el directorio con el metodo get
app.get('/',(req,res)=>{
    res.render('index');
    //res.send('Esta es la pagina principal - index')
})

//Es la vista o pagina HTML para la enviar la notificación 
app.get('/push',(req,res)=>{
    res.render('notificaciones');   
    //res.send('Aqui va la pagina de Notificaciones Push');
})

//Esta es para responder con cualquier otra pagina
//Que no se encuentre
app.get('*',(req,res)=>{
    res.render('404');
    //res.send('404 | Pagina no encontrada');
})

app.listen(puerto,()=>{
    console.log('Servidor corriendo en el puerto: ',puerto);
})