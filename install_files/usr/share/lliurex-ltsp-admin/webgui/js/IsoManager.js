
var srv_ip="unknown"
var status="available";
var section="IsoManager"
var OriginalStateNetinstall=""

var ErrorMessage=new Array();


function parseData(data) {
    return data.getDate()+"/"+(data.getMonth()+1)+"/"+data.getFullYear();
}


function add_text_to_output(text) {
    /*
    Add text to shell output, line by line
    */
//[llxptspmsg] Stage 2 of 2. Regenerating client

    htmltext=decodeURIComponent(text);

    lines=htmltext.split('<br />');
    for (i=0;i<lines.length;i++) {
            if (lines[i].substr(0,12)=="[llxptspmsg]"){
                $("#shellheader").empty();
                $("#shellheader").append("<span>"+lines[i].substr(12)+"</span>");
            }
    }

    $("#shellbox").show();
    $("#shell").append("<p>"+htmltext+"</p>");
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

function getiso() {
    //a=$('#FileSelector').click();
    //alert(a.val());
    location.href='ltsp://SelectIso/';
}

$(document).ready(function() {

    srv_ip=getUrlVar('srv_ip');
    netinst_installed=getUrlVar('netinst_installed');
    netinst_available=getUrlVar('netinst_available');
    
    
    /*  NETINSTALL  */
    
    titleNetinst=gettext("Network installer")
    $("#titleNetinstallManager").append(titleNetinst);
    
    helpnetinst=gettext("With this option, you can install LliueX in multiple systems using Netinstall process (debian installer).")
    $("#helptipnetinst").append(helpnetinst);

    if (netinst_installed=="True") {
        if (netinst_available=="True") {
            checked="checked='checked'";
            OriginalStateNetinstall="available"; // Set Original state to avoid multiple selections
        } else {
                checked="";
                OriginalStateNetinstall="unavailable"; // Set Original state to avoid multiple selections
        };

        
        netinstcontent="<input id='checkinst' style='display: block; float: left; margin-left: 50px; clear: both;' onchange='handleChange(this);' class='ClientItemCheckBox' \
                    type='checkbox' name='allownetinst' value='enabled' "+checked+">"+gettext("Allow network installation")+"</div>";
        /*btinst="<div id='BtCreateMenus' class='BtNetInst BtCreateMenus' onclick='alert()'>"+gettext("Apply Changes")+"</div> \
                <div id='TextMenus'>"+gettext("Use this button Apply changes to startup menu in clients, and allow/disable network installation.")+".</div>";
        */
        btinst="<div id='BtCreateMenus' class='BtNetInstUnchecked'>"+gettext("Apply Changes")+"</div> \
                <div id='TextMenus'>"+gettext("Use this button Apply changes to startup menu in clients, and allow/disable network installation.")+".</div>";
        netinstcontent+=btinst;
        $("#NetinstContainer").append(netinstcontent);

    } else{
        text="<div style='margin-top: 10px;margin-left:50px; float:left; clear:both; width:600px; height:150px'>";
        text+="<div style='float:left; clear:left; height: 80px; width:80px;'><img src='images/warning.png' /></div>";
        text+="<div style='font-size: 1.1em; font-weight: bold; float:left; clear:right; margin-left: 50px; width:500px; height: 20px;'>";
        text+=gettext("Package LliureX NetInstall is not installed.")+"</div>"
        text+="<div style='float:left; clear:right; margin-left: 50px; width:500px; height: 20px;'>";
        text+=gettext("Package llx-netinst is not installed on server. Please, install it to be able to perform a Network Installation.</div>")
        text+="</div>"
        $("#NetinstContainer").append(text);

    }
    
    /* END NETINSTALL */
    
    
    /* ISO MANAGER */

    titleIsos=gettext("Iso Manager")
    $("#titleIsoManager").append(titleIsos);
    
    if (srv_ip=="127.0.0.1") {
    // We are in server, so we can continue...
        
        // Print Help tip
        tiptext=gettext("From Network Installation you'll be able to install a full classroom through \
            its local network. You can select an iso to install, or install directly from mirror.")
        $("#helptip").append(tiptext);
    
        // Button to import image
        btiso="<div id='BtIso' class='BtIso BtNetInst' onclick='getiso()'>"+gettext("Add iso")+"</div> \
            <div id='TextIso'>"+gettext("Use this button to register a new iso to install on the classroom computers")+".</div>\
              <input id='FileSelector' type='file' style='visibility:hidden' />";
        $("#BtIsoContainer").append(btiso);    
        
    }else{
        text="<div style='margin-top: 10px;margin-left:50px; float:left; clear:both; width:600px; height:150px'>";
        text+="<div style='float:left; clear:left; height: 80px; width:80px;'><img src='images/warning.png' /></div>";
        text+="<div style='font-size: 1.1em; font-weight: bold; float:left; clear:right; margin-left: 50px; width:500px; height: 20px;'>";
        text+=gettext("You are not in the server")+"</div>"
        text+="<div style='float:left; clear:right; margin-left: 50px; width:500px; height: 20px;'>";
        text+=gettext("By efficiency, you only can perform this action from the LTSP server (IP: 127.0.0.1).</div>")
        text+="</div>"
        $("#helptip").append(text);
        /*$("#helptip").append(alerttitle);
        $("#helptip").append(alerttext);*/

        
    }
    
    $("#IsoManagerContainer").css("display", "block");
    $("#ConfirmWindow").css('display', 'none');
    $("#shellbox").css('display', 'none');
    $("#bottom").append("<span>Connected to server: "+srv_ip+"</span>");
    
    
    

    //setSection("isoManager");
    //$("#MiniIsoManager").style('background-color', '#ffffff', 'important');
    
});

function ModifyPXEMenu(netinstall) {
    location.href='ltsp://SetPXENetinst/'+netinstall;
}

function handleChange(cb) {
    
    if (cb.checked){
         action="available";
        }
    if (!cb.checked){
        action="unavailable";
        }

    if (action==OriginalStateNetinstall){ 
        //alert("Set "+action+"\n"+"Original State was "+OriginalStateNetinstall+"\n INHABILITA BOTO");
        $("#BtCreateMenus").removeClass("BtNetInst BtCreateMenus").addClass("BtNetInstUnchecked");
    } else{
        //alert("Set "+action+"\n"+"Original State was "+OriginalStateNetinstall+"\n HABILITA BOTO ****");
        $("#BtCreateMenus").removeClass("BtNetInstUnchecked").addClass("BtNetInst BtCreateMenus");
    }
    
    $("#BtCreateMenus").off('click');
    $("#BtCreateMenus").click(function(){
        if ($("#BtCreateMenus").hasClass("BtNetInst"))
        {
            //alert ("PENDING !!");
            ModifyPXEMenu(action);
            OriginalStateNetinstall=action;
        }
        $("#BtCreateMenus").removeClass("BtNetInst BtCreateMenus").addClass("BtNetInstUnchecked");
    //ModifyPXEMenu(action);
    })    

}

    

function setStatus(newstatus){
    status=newstatus;
}