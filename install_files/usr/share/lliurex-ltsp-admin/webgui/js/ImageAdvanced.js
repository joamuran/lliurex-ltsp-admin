var lastid=0; // To save the last image id
//var clientData=new Object();
var metaPkgData = new Object();
var chrootpath="";
var section="ImageManager"
var ChrootChanged=false 

var status="available";


var DesktopApps= {"Apps": [
        {"id": "synaptic",
        "icon": "styles/images/synaptic.png",
         "text": gettext("Synaptic, Package Manager")},
        {"id": "lliurex-up",
        "icon": "styles/images/lliurex-up.png",
         "text": gettext("LliureX-Up, System Updter")},
        {"id": "gnome-terminal",
        "icon": "styles/images/gnome-terminal.png",
         "text": gettext("Terminal")},
        {"id": "texteditor",
        "icon": "styles/images/accessories-text-editor.png",
         "text": gettext("Edit File")},
        {"id": "run_command",
        "icon": "styles/images/run_command.png",
         "text": gettext("Run Command")},
        {"id": "launch_session",
        "icon": "styles/images/session.png",
         "text": gettext("Start Session")},
        {"id": "llum",
        "icon": "styles/images/llum.png",
         "text": gettext("Classroom User Management")},
        {"id": "xfce",
        "icon": "styles/images/llx-xfcelogo.png",
         "text": gettext("Install LliureX Light Desktop")}]}



function DisplayDesktop() {
    /*
    Display icons in desktop
    */
        var AppsList="";
        for (var i=0;i<DesktopApps.Apps.length;i++)
            if (DesktopApps.Apps[i].id!="xfce" || xfce_installed!='True') {
            AppsList=AppsList+"<div class='iconContainer' onclick='ExecuteApp(this);' id='"+DesktopApps.Apps[i].id+"'> \
                    <div class='iconImage'><img src='"+DesktopApps.Apps[i].icon+"'/></div> \
                    <div class='iconText'>"+gettext(DesktopApps.Apps[i].text)+"</div> </div>";
        }
            AppsList=AppsList+"<div id='iconImageApply' class='ApplyiconContainer' style='float:right;' onclick='ExecuteApp(this);' id='apply'> \
                    <div class='iconImageApply'><img src='styles/images/lliurex-installer.png'/></div> \
                    <div class='iconText'>"+gettext('Apply to Image')+"</div> </div>";
        $("#ImageDesktop").append(AppsList);
}


function ShowConsole(args) { /*unused?*/
    shellMsg="<p>"+unescape(args)+"</p>";
    $("#shell").append(shellMsg);
    //alert();    
}

function ExecuteApp(cb) {
    if(status=='available') {
        if (cb.id=="run_command") {
            command=prompt(gettext('Run command:'), 'xterm');
        } else command=cb.id;
    
        if (cb.id=="launch_session") {
            $('#WaitingText').empty();
            $('#WaitingText').append(gettext("Wait until Session Start. It coult take a while. Please, be patient."));
            $('#WaitingWindow').css('display', 'block');
        }

        if (cb.id=="apply"||cb.id=="iconImageApply") {
            $('#WaitingText').empty();
            $('#WaitingText').append(gettext("Checking for free space. Please Wait."));
            $('#WaitingWindow').css('display', 'block');
            
        }

 

    }
    

    setTimeout(function() 
        {
            if (command=='apply'||command=='iconImageApply') {
                ChrootChanged=false;
                newlocation='ltsp://ApplyChangesToImageWithCheck/'+command+'/'+encodeURIComponent(chrootpath);
                location.href=newlocation;
                }
            else{
                ChrootChanged=true;
                newlocation='ltsp://ExecuteInChroot/'+command+'/'+encodeURIComponent(chrootpath);
                location.href=newlocation;
                //show_apply_button();
                //alert("Execute:"+newlocation);
                
            }
        }, 1);

}

/*function handleChange(cb) {
    if (cb.checked){
        for (var i=0; i<document.getElementsByName(cb.name).length;i++)
            document.getElementsByName(cb.name).item(i).checked=true;
        }
    if (!cb.checked){
        for (var i=0; i<document.getElementsByName(cb.name).length;i++)
            document.getElementsByName(cb.name).item(i).checked=false;
        }
}*/

 
   /* 
function ShowDetails(name){
    //# Show or hide details about an specific client
    
        
    if($("#MetaDetails"+name).css("display")=="block")
    {
        $("#MetaDetails"+name).slideUp(300);
        //$("#ClientRowArrow"+i).animate({  borderSpacing: 0 }, {
        $("#MetaRowArrow"+name).animate({  borderSpacing: 0 }, {
            step: function(now,fx) {
              $(this).css('-webkit-transform','rotate('+now+'deg)');
              $(this).css('-moz-transform','rotate('+now+'deg)'); 
            $(this).css('transform','rotate('+now+'deg)');  
            },
            duration:'normal'},'linear');
    }
    else
    {
        $("#MetaDetails"+name).slideDown(300);
        $("#MetaRowArrow"+name).animate({  borderSpacing: 90 }, {
            step: function(now,fx) {
              $(this).css('-webkit-transform','rotate('+now+'deg)');
              $(this).css('-moz-transform','rotate('+now+'deg)'); 
            $(this).css('transform','rotate('+now+'deg)');  
            },
            duration:'normal'},'linear');
    };
}

*/

/*function BindEventHandlers(){
    alert("123");

   
    }*/


function setStatus(newstatus){
    status=newstatus;
}

function add_text_to_output(text) {
    //$("#shell").hide();
    $("#shellbox").show();
    $('#WaitingWindow').css('display', 'none');    
    //alert(text)
    $("#shell").append("<p>"+decodeURIComponent(text)+"</p>");
    
    $("#shell").animate({scrollTop: $("#shell")[0].scrollHeight});

    

     return true;
}


function add_last_line_to_output(text) {
   if (text!="") {
        
     $("#shellbox").show();
     $('#lastline').remove();
     percent=decodeURIComponent(text);
     progress="["
     for (i=0;i<parseInt(percent);i++) {
        progress=progress+"=";
     }
     progress=progress+"]  " + percent +"%";
     $("#shell").append("<p id='lastline'>"+progress+"</p>");
     $("#shell").animate({scrollTop: $("#shell")[0].scrollHeight});
   }

}

function AskWhatToDoIfNotEnoughSpace(file, space, used) {
    
    MyConfirm(gettext("There is no enough free space on disk! The image "+
              file+" takes "+Math.round((used)/10000000)/100+ "GB, so there is need "+
              Math.round((used*3)/10000000)/100+" GB. There are only "+Math.round(space/10000000)/100+" Gb on disk."),
             gettext("Not enough space"),
            function(ret){
                newlocation='ltsp://ApplyChangesToImage/apply/'+encodeURIComponent(chrootpath)+'/'+ret;
                location.href=newlocation;
            });

    $('#WaitingWindow').css('display', 'none');    
 
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
    }*/
    
    
    ChrootChanged=false
    //alert(window.location.search.substring(1).split('?')[0])
    var meta=getUrlVar('meta'); // name
    chrootpath=getUrlVar('chroot');
    xfce_installed=getUrlVar('xdesktop');

    switch (meta) {
        case "client":
            $("#ImageDesktop").addClass("Desktop");
            break;
        case "desktop":
            $("#ImageDesktop").addClass("Desktop");
            break;
        case "infantil":
            $("#ImageDesktop").addClass("Infantil");
            break;
        case "lite":
            $("#ImageDesktop").addClass("Lite");
            break;
        case "pime":
            $("#ImageDesktop").addClass("Pime");
            break;
        case "musica":
            $("#ImageDesktop").addClass("Musica");
            break;
    }
    
    DisplayDesktop();

    // Hide Console
    $("#shellbox").hide();



    $("#CloseButton").bind('click', function( event ){
        $('#WaitingWindow').css('display', 'none');
    })


    $("#CloseButtonShell").bind('click', function( event ){
        if (status=='available') {
            $('#shellbox').css('display', 'none');
            //$('#WaitingWindow').css('display', 'none');
        }

    })

 hide_apply_button();

});

function hide_apply_button(){
    /*$('#iconImageApply').animate({
        width: $('#iconImageApply').css('width') == '165px' ? '150px' : '165px',
        opacity:  $('#iconImageApply').css('opacity') == '0.1' ? '0.9' : '0.1'
        //left:  $('#iconImageApply').css('left') == '-55' ? '0px' : '-55'
    }, 500, animate_apply_button);*/
  //$('#iconImageApply').css('width', '0px');
  $('#iconImageApply').hide();

}

function show_apply_button(){
        $('#iconImageApply').fadeIn(1500);
        $('#iconImageApply').append("<img id='hand' style='position: relative; float:left; z-index:1; bottom:60px;' src='styles/images/hand.png'>");
        function movehand(){
                $('#hand').animate({
                left: $('#hand').css('left') == '10px' ? '0px' : '10px',
                bottom: $('#hand').css('bottom') == '60px' ? '70px' : '60px'
        }, 500, movehand);
        }
        movehand();
        
        
}
       
       
/*
function animateHeart() {
    $('span.heart').animate({
        fontSize: $('span.heart').css('fontSize') == '60px' ? '50px' : '60px'
    }, 500, animateHeart);
};
*/
window.onbeforeunload = unloadPage;

function unloadPage(){
        if(ChrootChanged==true){
                return gettext("If you did changes into client, you have to Apply them to images by clicking in 'Apply to image' to be effective. Continue anyway?");
        }
}

function ShowApplyMessage(){
        $('#hand').remove();
        showDescription();
}

function showDescription(){
    
     title="Apply to Image";
     version="";
     text="<div style='margin-left: 150px;'>If you have performed any change into this image client, and you want these changes to be effective, you have to press on <i>Apply to Image</i> buttom to Apply these changes to Client Image.</div>";
     image="images/apply-changes.png";
     //buttons={"ok":{"text":"d'Acord","ReturnValue":"true","image":"images/ok.png"},"ok2":{"text":"d'Acord","ReturnValue":"true","image":"images/ok.png"}};     
     buttons={"ok":{"text":"Ok","ReturnValue":"false","image":"images/check.png"}};
     tip=""
     
          
     ShowDialog(title, text, image, buttons, tip, function(response){
        show_apply_button();
        });
}


// Event Dispatchers
// Functions called from python

// Event Handlers
// Handle events on page to python
