var srvip="";

function DisplayLoginWindow(){
    loginform="<div class='FormTitle'>"+gettext("User Authentication")+"</div>\
        <div class='FormSmalText'>"+gettext("This application requires user authentication and admin privileges.")+"</div>\
        <div class='FormText'>"+gettext("User")+"</div>\
        <div><input class='FormInput' type='text' id='username'/></div>\
        <div class='FormText'>"+gettext("Password")+"</div>\
        <div><input class='FormInput' type='password' id='userpass'/></div>\
        \
        <div class='FormText'>"+gettext("Server")+"\
        <input class='FormInput' type='text' style='width:300px; float:right;clear:left' id='remoteserver' value='"+srvip+"'/></div>\
        \
        <div id='ErrorLoginMessage' class='ErrorLoginMessage'></div>\
        <div class='Button Login' id='LoginButton'>"+gettext("Login")+"</div>";
    
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
    /*function getUrlVar(uv) {
        //extract the query string from the url
    //var query = window.location.search.substring(1);
    var query = window.location.search.substring(1).split('?')[0]
        //split the query into separate name/value pairs
    var vars = query.split("&amp;");
    for (var i=0;i<vars.length;i++) {
                //split each pair into separate names and values
        var pair = vars[i].split("=");
                //find the required name and return it's value
        if (pair[0] == uv) {
            return pair[1];
        }
        }
    return false;
    }
    */
    srvip=getUrlVar('server'); // name
    //mirror_installed=getUrlVar('mirror_installed');
    
    
    // Display Main Window
    DisplayLoginWindow();
    
    // Hide or show buttons depending on mirror is installed or not

    /*if (mirrorData["installed"]=="true"){
        alert(mirror_installed)
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
    */
    // Bind events with actions
    
    BindLoginEventHandlers();
    
});


// Event Dispatchers
// Functions called from python

function loginSuccess(mirror_installed){
    
    
    if (mirror_installed=="available"){
        buttons="<div class='BigButton ButtonClients' id='ClientManager'>"+gettext("Manage Clients")+"</div> \
          <div class='BigButton ButtonImages' id='ImageManager'>"+gettext("Manage Images")+"</div> \
          <div class='BigButton ButtonMirror' id='MirrorManager'><div>"+gettext("Update Mirror")+"</div> \
          <div style='font-size:0.6em;'>"+gettext("last: ")+mirrorData["date"]+"</div></div>";
        $("#ButtonList").empty();
        $("#ButtonList").append(buttons);
    }
    else{
        buttons="<div class='BigButton ButtonClients unavailable' id='ClientManagerUninstalled'>"+gettext("Manage Clients")+"</div> \
          <div class='BigButton ButtonImages unavailable' id='ImageManagerUninstalled'>"+gettext("Manage Images")+"</div> \
          <div class='BigButton ButtonMirror' id='MirrorManager'>"+gettext("Create Mirror")+"</div>";
        $("#ButtonList").empty();
        $("#ButtonList").append(buttons);
        }
    
    // Binding New Event Handlers
    BindMainEventHandlers();
    
    $("#LoginForm").css("display", "none");
    $("#InitialWindow").css("display", "block");
    
    
}

function loginFail(username){
    $("#ErrorLoginMessage").empty();
    $("#ErrorLoginMessage").append(gettext("<span>Authentication Error</span>"));
}


// Event Handlers
// Handle events on page to python

function BindLoginEventHandlers(){
    // Click on Login Button
    $("#LoginButton").bind('click', function( event ){
        
        $("#ErrorLoginMessage").empty();
        $("#ErrorLoginMessage").append(gettext("<span>Validing user...</span>"));
        
        // We must establish a timeout to wait that jquery writes the validating message
        setTimeout(function() 
        {location.href='ltsp://login/'+escape($("#username").val())+'/'+escape($("#userpass").val())+'/'+escape($("#remoteserver").val());
        }, 1);
        
    });
}

function BindMainEventHandlers(){
   
   
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
