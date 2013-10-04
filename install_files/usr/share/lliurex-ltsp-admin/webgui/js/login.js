var srvip="";

function DisplayLoginWindow(){
    loginform="<div class='FormTitle'>"+gettext("User Authentication")+"</div>\
        <div class='FormSmalText'>"+gettext("This application requires user authentication and admin privileges.")+"</div>\
        <div class='FormText'>"+gettext("User")+"</div>\
        <div><input class='FormInput' tabindex='1' type='text' id='username'/></div>\
        <div class='FormText'>"+gettext("Password")+"</div>\
        <div><input class='FormInput' type='password' id='userpass' tabindex='2'/></div>\
        \
                \
        <div class='ServerBoxContainer'><div id='ServerBox' class='ServerBox'> \
        <div class='FormText'>"+gettext("Server")+"</div>\
        <input class='FormInput' tabindex='4' type='text' id='remoteserver' style='width:350px;' value='"+srvip+"'/></div>\
        </div> \
        <div class='ServerTabContainer'><div onclick='handleServerTab()' class='ServerTab' tabindex='3' id='AdvTab'>Advanced</div></div> \
        </div> \
        \
        <div id='ErrorLoginMessage' class='ErrorLoginMessage'></div>\
        <div id='ErrorLoginImage' class='ErrorLoginMessage'></div>\
        <div tabindex='5' class='Button Login' id='LoginButton'>"+gettext("Login")+"</div>";
    
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
  
    $("#AdvTab").keydown(function (e) {
        if ((e.which=='13'||e.which=='32'||e.which=='40')&&($("#ServerBox").css("display")!="block")) {
                handleServerTab();
        }
    else if ((e.which=='13'||e.which=='32'||e.which=='38')&&($("#ServerBox").css("display")=="block")) {
                handleServerTab();
        }
    
    });
}


function handleServerTab() {
    
    if($("#ServerBox").css("display")=="block") $("#ServerBox").slideUp(300);
        else $("#ServerBox").slideDown(300);
}

$(document).ready(function() {
    
    srvip=getUrlVar('server'); // name
    //mirror_installed=getUrlVar('mirror_installed');
    
    
    // Display Main Window
    DisplayLoginWindow();
    
    // Hide or show buttons depending on mirror is installed or not

    /*if (mirrorData["installed"]=="true"){
        alert(mirror_installed)
        buttons="<div class='BigButton ButtonClients' id='ClientManager'>"+gettext("Manage Classroom")+"</div> \
          <div class='BigButton ButtonImages' id='ImageManager'>"+gettext("Manage Images")+"</div> \
          <div class='BigButton ButtonMirror' id='MirrorManager'><div>"+gettext("Update Mirror")+"</div> \
          <div style='font-size:0.6em;'>"+gettext("last: ")+mirrorData["date"]+"</div></div>";
        $("#ButtonList").empty();
        $("#ButtonList").append(buttons);
    }
    else{
        buttons="<div class='BigButton ButtonClients unavailable' id='ClientManager'>"+gettext("Manage Classroom")+"</div> \
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

function loginSuccess(mirror_installed, pool_ok){
    $('body').css('cursor', 'default');
    if(pool_ok=="False"){
	$("#MirrorMessage").empty();
	$("#MirrorMessage").show();
	$("#MirrorMessage").append(gettext("<span><stong>Warning: </strong>Mirror seems to be inconsistent, so, installations and image creation won't success. Please, refresh it from Mirror Manager.</span>"));
     }
    
    var mirrorData={"installed": "true", "date": "10/10/2012"}
    
    if (mirror_installed=="available"){
        buttons="<div tabindex='4' class='BigButton ButtonNetinst' style='margin-top:5px !important' id='NetInstall'>"+gettext("Network Install")+"</div> \
          <div tabindex='3' class='BigButton ButtonClients' style='margin-top:5px !important' id='ClientManager'>"+gettext("Manage Classroom")+"</div> \
          <div tabindex='2' class='BigButton ButtonImages' style='margin-top:5px !important' id='ImageManager'>"+gettext("Manage Images")+"</div> \
          <div tabindex='1' class='BigButton ButtonMirror' style='margin-top:5px !important' id='MirrorManager'><div>"+gettext("Mirror Manager")+"</div> \
          <div style='font-size:0.6em;'>"+gettext("last: ")+mirrorData["date"]+"</div></div>";
        $("#ButtonList").empty();
        $("#ButtonList").append(buttons);
    }
    else if (mirror_installed=="busy"){
	    buttons="<div class='BigButton ButtonNetinst unavailable' style='margin-top:5px !important' id='NetinstallUninstalled'>"+gettext("Network Install")+"</div> \
	    <div class='BigButton ButtonClients' style='margin-top:5px !important' id='ClientManager'>"+gettext("Manage Classroom")+"</div> \
              <div class='BigButton ButtonImages unavailable' style='margin-top:5px !important' id='ImageManagerUninstalled'>"+gettext("Manage Images")+"</div> \
	    <div tabindex='1' class='BigButton ButtonMirror unavailable' style='margin-top:5px !important' id='MirrorManager'>"+gettext("Create Mirror")+"</div>";
	    $("#ButtonList").empty();
            $("#ButtonList").append(buttons);
	  } else {
	      buttons="<div class='BigButton ButtonNetinst unavailable' style='margin-top:5px !important' id='NetinstallUninstalled'>"+gettext("Network Install")+"</div> \
	    <div class='BigButton ButtonClients unavailable' style='margin-top:5px !important' id='ClientManagerUninstalled'>"+gettext("Manage Classroom")+"</div> \
              <div class='BigButton ButtonImages unavailable' style='margin-top:5px !important' id='ImageManagerUninstalled'>"+gettext("Manage Images")+"</div> \
	    <div tabindex='1' class='BigButton ButtonMirror' style='margin-top:5px !important' id='MirrorManager'>"+gettext("Create Mirror")+"</div>";
	    $("#ButtonList").empty();
            $("#ButtonList").append(buttons);
	}
    
    
    
    // Binding New Event Handlers
    BindMainEventHandlers();
    
    $("#LoginForm").css("display", "none");
    $("#InitialWindow").css("display", "block");
}

function loginFail(username){
    $('body').css('cursor', 'default');
    $("#ErrorLoginMessage").empty();
    $("#ErrorLoginMessage").append(gettext("<span>Authentication Error</span>"));
}

// Event Handlers
// Handle events on page to python


// JQUERY PLUGIN TO DETECT "ENTER" KEY
$.fn.enterKey = function (fnc) {
    return this.each(function () {
        $(this).keypress(function (ev) {
            var keycode = (ev.keyCode ? ev.keyCode : ev.which);
            if (keycode == '13') {
                fnc.call(this, ev);
            }
        })
    })
}


function SubmitLogin() {
        $('body').css('cursor', 'wait');  // Seem that does not run...

        $("#ErrorLoginMessage").empty();
        $("#ErrorLoginMessage").append(gettext("<span>Validating user...</span>"));
        
        // We must establish a timeout to wait that jquery writes the validating message
        setTimeout(function() 
        {
            location.href='ltsp://login/'+escape($("#username").val())+'/'+escape($("#userpass").val())+'/'+escape($("#remoteserver").val());
        }, 0.5);
}

function BindLoginEventHandlers(){
    // Click on Login Button

    $("#LoginButton").bind('click', function( event ){
        SubmitLogin();        
    });

    $("#LoginButton").enterKey(function () {
        SubmitLogin() ;
    })
    
    $("#userpass").enterKey(function () {
        SubmitLogin() ;
    })
}

function BindMainEventHandlers(){
   
    $("#ClientManager").bind('click', function( event ){
        location.href='ltsp://ClientManager';
    });
     
    $("#NetInstall").bind('click', function( event ){
        location.href='ltsp://IsoManager';
    });
     

      $("#ImageManager").bind('click', function( event ){
        location.href='ltsp://ImageManager';
    });
      
       $("#MirrorManager").bind('click', function( event ){
        location.href='ltsp://MirrorManager';
    });

    $("#ClientManager").enterKey(function () {
        location.href='ltsp://ClientManager';
    });
     
      $("#ImageManager").enterKey(function () {
        location.href='ltsp://ImageManager';
    });
      
       $("#MirrorManager").enterKey(function () {
        location.href='ltsp://MirrorManager';
    });

    

}
