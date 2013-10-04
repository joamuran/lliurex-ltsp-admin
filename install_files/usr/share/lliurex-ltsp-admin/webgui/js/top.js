
$(document).ready(function() {
    
    mirror_installed=getUrlVar('mirror_installed');
    //alert (mirror_installed)
    
    // Hide or show buttons depending on mirror is installed or not
    //if (mirrorData["installed"]=="true"){
    if (mirror_installed=="available"){
        //alert ("hohoho")
        buttons="<div class='MiniButtonContainer'><span class='MiniButtonText' id='textclients'></span><span class='MiniButton ButtonClients' id='MiniClientManager'>"+gettext("Manage Classroom")+"</span></div> \
                 <div class='MiniButtonContainer'><span class='MiniButtonText'id='textimages' ></span><span class='MiniButton ButtonImages' id='MiniImageManager'>"+gettext("Manage Images")+"</span></div> \
                 <div class='MiniButtonContainer'><span class='MiniButtonText'id='textimages' ></span><span class='MiniButton ButtonImages' id='MiniIsoManager'>"+gettext("Network Installation")+"</span></div> \
                 <div class='MiniButtonContainer'><span class='MiniButtonText' id='textmirror'></span><span class='MiniButton ButtonMirror' id='MiniMirrorManager'>"+gettext("Update Mirror")+"</span></div>";
        
        $("#MiniButtonList").empty();
        $("#MiniButtonList").append(buttons);
    }
    else if (mirror_installed=="busy") {
        buttons="<div class='MiniButtonContainer'><span class='MiniButtonText' id='textclients'></span><span class='MiniButton ButtonClients' id='MiniClientManager'>"+gettext("Manage Classroom")+"</span></div> \
          <div class='BigButton ButtonImages unavailable' id='ImageManager'>"+gettext("Manage Images")+"</div> \
          <div class='BigButton ButtonImages unavailable' id='IsoManager'>"+gettext("Network Installation")+"</div> \
          <div class='BigButton ButtonMirror' id='MirrorManager'>"+gettext("Create Mirror")+"</div>";
    }
    else{
        buttons="<div class='BigButton ButtonClients unavailable' id='ClientManager'>"+gettext("Manage Classroom")+"</div> \
          <div class='BigButton ButtonImages unavailable' id='ImageManager'>"+gettext("Manage Images")+"</div> \
          <div class='BigButton ButtonImages unavailable' id='IsoManager'>"+gettext("Network Installation")+"</div> \
          <div class='BigButton ButtonMirror' id='MirrorManager'>"+gettext("Create Mirror")+"</div>";
        $("#ButtonList").empty();
        $("#ButtonList").append(buttons);
        }    


    /*$("#textclients").hide();
    $("#textimages").hide();
    $("#textmirror").hide();*/
    
    
    if (section) {
        /*$("#"+section).css("background-color", "#eeeeff");*/
        $("#"+section).css("background-color", "#4db2ff");
        $("#"+section).css("color", "#f5fafa");
        $("#"+section).css("border-color", "#89d8ff");
        /*$("#"+section).css("border-bottom", "0px");*/
        /*$("#Mini"+section).css("background-color", "#eeeeff");*/
        $("#Mini"+section).css("background-color", "#4db2ff");
        $("#Mini"+section).css("color", "#f5fafa");
        $("#Mini"+section).css("border-color", "#89d8ff");
        /*$("#Mini"+section).css("border-bottom", "0px");*/
    }
    
    // Bind events with actions
    BindEventHandlers();
});


// Event Dispatchers
// Functions called from python


// Event Handlers
// Handle events on page to python
function BindEventHandlers(){
    
    animate_duration=200;
    
    /*$("#MiniClientManager").bind('mouseover', function( event ){
        $("#textclients").fadeIn(animate_duration);
        $("#MiniClientManager").animate({'width':'100px','height':'32px'},animate_duration);    
    });
    
    $("#MiniClientManager").bind('mouseout', function( event ){
        $("#textclients").fadeOut(animate_duration);
        $("#MiniClientManager").animate({'width':'100px','height':'16px'},animate_duration);
    });
   
   $("#MiniImageManager").bind('mouseover', function( event ){
        $("#textimages").fadeIn(animate_duration);
        $("#MiniImageManager").animate({'width':'100px','height':'32px'},animate_duration);
    }); 
    $("#MiniImageManager").bind('mouseout', function( event ){
        $("#textimages").fadeOut(animate_duration);
        $("#MiniImageManager").animate({'width':'100px','height':'16px'},animate_duration);
    });
    
    $("#MiniMirrorManager").bind('mouseover', function( event ){
        $("#textmirror").fadeIn(animate_duration);
        $("#MiniMirrorManager").animate({'width':'100px','height':'32px'},animate_duration);
    }); 
    $("#MiniMirrorManager").bind('mouseout', function( event ){
        $("#textmirror").fadeOut(animate_duration);
        $("#MiniMirrorManager").animate({'width':'100px','height':'16px'},animate_duration);
    });*/
   
   
   /*$("#textclients").show();*/
   
     $("#MiniClientManager").bind('click', function( event ){
        location.href='ltsp://ClientManager';
    });
     
    $("#MiniImageManager").bind('click', function( event ){
        location.href='ltsp://ImageManager';
    });

    $("#MiniIsoManager").bind('click', function( event ){
        location.href='ltsp://IsoManager';
    });
      
    $("#MiniMirrorManager").bind('click', function( event ){
        location.href='ltsp://MirrorManager';
    });

    $("#MiniMirrorManager").bind('click', function( event ){
        location.href='ltsp://MirrorManager';
    });

}
