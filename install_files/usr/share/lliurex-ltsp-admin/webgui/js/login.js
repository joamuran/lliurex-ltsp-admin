
function DisplayLoginWindow(){
    $("#LoginContainer").css("display", "block");
}

$(document).ready(function() {
    
    // Display Main Window
    DisplayLoginWindow();
    
    // Hide or show buttons depending on mirror is installed or not
    if (mirrorData["installed"]=="true"){
        buttons="<div class='BigButton ButtonClients' id='ClientManager'>Manage Clients</div> \
          <div class='BigButton ButtonImages' id='ImageManager'>Manage Images</div> \
          <div class='BigButton ButtonMirror' id='MirrorManager'><div>Update Mirror</div> \
          <div style='font-size:0.6em;'>last:"+mirrorData["date"]+"</div></div>";
        $("#ButtonList").empty();
        $("#ButtonList").append(buttons);
    }
    else{
        buttons="<div class='BigButton ButtonClients unavailable' id='ClientManager'>Manage Clients</div> \
          <div class='BigButton ButtonImages unavailable' id='ImageManager'>Manage Images</div> \
          <div class='BigButton ButtonMirror' id='MirrorManager'>Create Mirror</div>";
        $("#ButtonList").empty();
        $("#ButtonList").append(buttons);
        }
    
    // Bind events with actions
    BindEventHandlers();
    
});


// Event Dispatchers
// Functions called from python

function loginSuccess(){
    $("#LoginForm").css("display", "none");
    $("#InitialWindow").css("display", "block");
}

function loginFail(username){
    $("#ErrorLoginMessage").empty();
    $("#ErrorLoginMessage").append("<span>Error d'autenticació</span>");
}


// Event Handlers
// Handle events on page to python
function BindEventHandlers(){
   
    // Click on Login Button
    $("#LoginButton").bind('click', function( event ){
        location.href='ltsp://login/'+escape($("#username").val())+'/'+escape($("#userpass").val());
    
    });
    
     $("#ClientManager").bind('click', function( event ){
        location.href='ltsp://ClientManager';
    });
     
      $("#ImageManager").bind('click', function( event ){
        location.href='ltsp://ImageManager';
    });
      
       $("#MirrorManager").bind('click', function( event ){
        location.href='ltsp://MirrorManager';
    });

}
