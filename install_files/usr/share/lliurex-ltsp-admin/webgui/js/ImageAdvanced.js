
var lastid=0; // To save the last image id
//var clientData=new Object();
var metaPkgData = new Object();
var chrootpath="";

var status="available";

var DesktopApps= {"Apps": [
        {"id": "synaptic",
        "icon": "styles/images/synaptic.png",
         "text": "Synaptic, Package Manager"},
        {"id": "terminal",
        "icon": "styles/images/gnome-terminal.png",
         "text": "Terminal"},
        {"id": "texteditor",
        "icon": "styles/images/accessories-text-editor.png",
         "text": "Edit File"},
        {"id": "run_command",
        "icon": "styles/images/run_command.png",
         "text": "Run Command"},
        {"id": "launch_session",
        "icon": "styles/images/session.png",
         "text": "Start Session"},
        {"id": "xfce",
        "icon": "styles/images/llx-xfcelogo.png",
         "text": "Install LliureX Light Desktop"}]}



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
            AppsList=AppsList+"<div class='ApplyiconContainer' style='float:right;' onclick='ExecuteApp(this);' id='apply'> \
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

        if (cb.id=="apply") {
            $('#WaitingText').empty();
            $('#WaitingText').append(gettext("Calculating free space. Please Wait."));
            $('#WaitingWindow').css('display', 'block');
            
        }

 

    }
    

    setTimeout(function() 
        {
            if (command=='apply') {
                newlocation='ltsp://ApplyChangesToImageWithCheck/'+command+'/'+encodeURIComponent(chrootpath);
                location.href=newlocation;
                }
            else{
                newlocation='ltsp://ExecuteInChroot/'+command+'/'+encodeURIComponent(chrootpath);
                //alert("Execute:"+newlocation);
                location.href=newlocation;
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
     $("#shellbox").show();
     $('#lastline').remove();
     percent=decodeURIComponent(text);
     progress="["
     for (i=0;i<parseInt(percent);i++) {
        progress=progress+"=";
     }
     progress=progress+"]  " + percent +"%";
     $("#shell").append("<p id='lastline'>"+progress+"</p>");

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



});

// Event Dispatchers
// Functions called from python

// Event Handlers
// Handle events on page to python
