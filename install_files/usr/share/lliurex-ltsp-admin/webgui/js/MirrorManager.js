
function DisplayMirrorOptions(mirror_installed){
    if (!mirror_installed) {
        MirrorButton="<div class='BigButton ButtonMirror' id='InstallMirror'><div>"+gettext("Install Mirror")+"</div>";
    } else
        MirrorButton="<div class='BigButton ButtonMirror' id='UpdateMirror'><div>"+gettext("Update Mirror")+"</div>";
    
    $("#AppContainer").append(MirrorButton);
    
    
    
    }

$(document).ready(function() {
    // Bind events with actions
    
    mirror_installed=getUrlVar('mirror_installed');
    srv_ip=getUrlVar('srv_ip');
    $("#bottom").append("<span>"+gettext("Connected to server: ")+srv_ip+"</span>");
    
    DisplayMirrorOptions(mirror_installed);
    
    BindEventHandlers();
    
});


// Event Dispatchers
// Functions called from python




// Event Handlers
// Handle events on page to python
function BindEventHandlers(){
   
    // Click on Login Button
    /*$("#LoginButton").bind('click', function( event ){
        location.href='ltsp://login';
    });*/

}
