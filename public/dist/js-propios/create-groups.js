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
function createUser(){
    let groupName  = document.getElementById('groupName').value;
    let user  = document.getElementById('user').value;
    let TAG  = document.getElementById('TAG').value;
    let password  = document.getElementById('password').value;
    console.log(groupName, user, TAG, password);
    $.ajax({
        method:"POST",
        url: "http://localhost:3000/group/set-user",
        data: { 
            TAG: TAG,
            user: user,
            password: password,
            group: groupName
        },
        success: function( result ) {
          alert(result);
          location.reload();
        }
      });
      
}