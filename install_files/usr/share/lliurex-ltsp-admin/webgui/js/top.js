
$(document).ready(function() {
    
    mirror_installed=getUrlVar('mirror_installed');
    //alert (mirror_installed)
    
    // Hide or show buttons depending on mirror is installed or not
    //if (mirrorData["installed"]=="true"){
    if (mirror_installed=="available"){
        //alert ("hohoho")
        buttons="<div class='MiniButtonContainer'><span class='MiniButtonText' id='textclients'>"+gettext("Manage Clients")+"</span><div class='MiniButton ButtonClients' id='MiniClientManager'></div></div> \
                 <div class='MiniButtonContainer'><span class='MiniButtonText'id='textimages' >"+gettext("Manage Images")+"</span><div class='MiniButton ButtonImages' id='MiniImageManager'></div></div> \
                 <div class='MiniButtonContainer'><span class='MiniButtonText' id='textmirror'>"+gettext("Update Mirror")+"</span><div class='MiniButton ButtonMirror' id='MiniMirrorManager'></div></div>";
        
        $("#MiniButtonList").empty();
        $("#MiniButtonList").append(buttons);
    }
    else{
        buttons="<div class='BigButton ButtonClients unavailable' id='ClientManager'>"+gettext("Manage Clients")+"</div> \
          <div class='BigButton ButtonImages unavailable' id='ImageManager'>"+gettext("Manage Images")+"</div> \
          <div class='BigButton ButtonMirror' id='MirrorManager'>"+gettext("Create Mirror")+"</div>";
        $("#ButtonList").empty();
        $("#ButtonList").append(buttons);
        }    


    $("#textclients").hide();
    $("#textimages").hide();
    $("#textmirror").hide();
    
    // Bind events with actions
    BindEventHandlers();
});


// Event Dispatchers
// Functions called from python


// Event Handlers
// Handle events on page to python
function BindEventHandlers(){
    
    animate_duration=200;
    
    $("#MiniClientManager").bind('mouseover', function( event ){
        $("#textclients").fadeIn(animate_duration);
        $("#MiniClientManager").animate({'width':'32px','height':'32px'},animate_duration);    
    });
    
    $("#MiniClientManager").bind('mouseout', function( event ){
        $("#textclients").fadeOut(animate_duration);
        $("#MiniClientManager").animate({'width':'16px','height':'16px'},animate_duration);
    });
   
   $("#MiniImageManager").bind('mouseover', function( event ){
        $("#textimages").fadeIn(animate_duration);
        $("#MiniImageManager").animate({'width':'32px','height':'32px'},animate_duration);
    }); 
    $("#MiniImageManager").bind('mouseout', function( event ){
        $("#textimages").fadeOut(animate_duration);
        $("#MiniImageManager").animate({'width':'16px','height':'16px'},animate_duration);
    });
    
    $("#MiniMirrorManager").bind('mouseover', function( event ){
        $("#textmirror").fadeIn(animate_duration);
        $("#MiniMirrorManager").animate({'width':'32px','height':'32px'},animate_duration);
    }); 
    $("#MiniMirrorManager").bind('mouseout', function( event ){
        $("#textmirror").fadeOut(animate_duration);
        $("#MiniMirrorManager").animate({'width':'16px','height':'16px'},animate_duration);
    });
   
   
     $("#MiniClientManager").bind('click', function( event ){
        location.href='ltsp://ClientManager';
    });
     
      $("#MiniImageManager").bind('click', function( event ){
        location.href='ltsp://ImageManager';
    });
      
       $("#MiniMirrorManager").bind('click', function( event ){
        location.href='ltsp://MirrorManager';
    });

}
