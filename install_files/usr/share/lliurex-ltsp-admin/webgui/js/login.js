
function DisplayLoginWindow(){
    loginform="<div class='FormTitle'>"+gettext("User Authentication")+"</div>\
        <div class='FormSmalText'>"+gettext("This application requires user authentication and admin privileges.")+"</div>\
        <div class='FormText'>"+gettext("User.")+"</div>\
        <div><input class='FormInput' type='text' id='username'/></div>\
        <div class='FormText'>"+gettext("Password.")+"</div>\
        <div><input class='FormInput' type='text' id='userpass'/></div>\
        <div id='ErrorLoginMessage' class='ErrorLoginMessage'></div>\
        <div class='Button Login' id='LoginButton'>"+gettext("Login.")+"</div>";
    
    appdescription=gettext("Lliurex LTSP és una solució de clients lleugers per a LliureX basada en LTSP. Des d'aquest mateix gestor podreu: \
          <ul>\
            <li>Actualitzar el mirror del sistema, a partir del qual es crearan i mantindran els clients lleugers.</li>\
            <li>Gestionar i crear imatges de sistemes LliureX amb pocs clics, així com el programari instal·lat en elles.</li>\
            <li>Gestionar els clients lleugers per tal d'adaptar les imatges a particularitats dels clients, com baixa memòria o capacitat gràfica.</li>\
          </ul>");
    
    $("#LoginForm").append(loginform);
    
    $("#Title").append(gettext("Welcome to LliureX LTSP"));
    $("#Title").append(gettext("Welcome to LliureX LTSP"));
    $("#AppDescriptionText").append(appdescription);
    
    $("#LoginContainer").css("display", "block");
}

$(document).ready(function() {
    
    // Display Main Window
    DisplayLoginWindow();
    
    // Hide or show buttons depending on mirror is installed or not
    if (mirrorData["installed"]=="true"){
        buttons="<div class='BigButton ButtonClients' id='ClientManager'>"+gettext("Manage Clients")+"</div> \
          <div class='BigButton ButtonImages' id='ImageManager'>"+gettext("Manage Images")+"</div> \
          <div class='BigButton ButtonMirror' id='MirrorManager'><div>"+gettext("Update Mirror")+"</div> \
          <div style='font-size:0.6em;'>"+gettext("last: ")+mirrorData["date"]+"</div></div>";
        $("#ButtonList").empty();
        $("#ButtonList").append(buttons);
    }
    else{
        buttons="<div class='BigButton ButtonClients unavailable' id='ClientManager'>"+gettext("Manage Clients")+"</div> \
          <div class='BigButton ButtonImages unavailable' id='ImageManager'>"+gettext("Manage Images")+"</div> \
          <div class='BigButton ButtonMirror' id='MirrorManager'>"+gettext("Create Mirror")+"</div>";
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
    $("#ErrorLoginMessage").append(gettext("<span>Authentication Error</span>"));
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
