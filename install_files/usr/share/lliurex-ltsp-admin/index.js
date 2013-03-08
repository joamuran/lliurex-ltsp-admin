
function saluda(){
	alert("bienvenido terrícola");
	
}

function setStatus(status){
	$("#status").empty();
        $("#status").append("<div>Response: "+status+"</div>");    	
}


$(document).ready(function() {
    $("#setValue").bind('click', function( event ){
	alert('ltsp://'+"setValue/"+$("#entrada").val());
        location.href='ltsp://setValue/'+$("#entrada").val();
	
    });
     
     
    $("#getValue").bind('click', function( event ){
	alert("ltsp://getValue")
	location.href='ltsp://getValue';
    });
    


  
})
