//Vamos a usar JQUERY enviar la notificacion
function enviarNotificacion(){
    let tituloNotificacion  = document.getElementById('tituloNotificacion').value;
    let mensajeNotificacion = document.getElementById('mensajeNotificacion').value;
    let grupoNotificacion = document.getElementById('grupoNotificacion').value;
    $.ajax({
        method:"POST",
        url: "http://localhost:3000/notification/enviar-notificacion",
        data: { 
          groupName  : grupoNotificacion,
          titulo   : tituloNotificacion,
          mensaje : mensajeNotificacion,
          
        },
        success: function( result ) {
          alert(result);
          location.reload();
        }
      });
}