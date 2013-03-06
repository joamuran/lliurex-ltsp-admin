
function saluda(){
	alert("bienvenido terrícola");
	
}

$(document).ready(function() {

    $("#setValue").bind('click', function( event ){
        location.href='ltsp://'+"setValue"
    });
     
     
    $("#getValue").bind('click', function( event ){
        location.href='ltsp://'+"getValue/"+$("#entrada");
    });
    


  
})
