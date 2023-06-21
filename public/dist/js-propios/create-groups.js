//Vamos a usar JQUERY enviar la notificacion
function createGroup(){
    let groupName  = document.getElementById('groupName').value;
    $.ajax({
        method:"POST",
        url: "http://localhost:3000/group/set-group-name",
        data: { 
            groupName: groupName
        },
        success: function( result ) {
          alert(result);
          location.reload();
        }
      });
      
}