alert("Aqui con el click me envia la notificacion")

//Vamos a usar JQUERY enviar la notificacion
function enviarNotificacion(){
    let tituloNotificacion  = document.getElementById('tituloNotificacion').value;
    let mensajeNotificacion = document.getElementById('mensajeNotificacion').value;
    let tokenNotificacion   = document.getElementById('tokenNotificacion').value;
    $.ajax({
        method:"POST",
        url: "http://localhost:3000/enviar-notificacion",
        data: { 
          titulo  : tituloNotificacion,
          mensaje : mensajeNotificacion,
          token   : tokenNotificacion
        },
        success: function( result ) {
          alert(result);
        }
      });
}