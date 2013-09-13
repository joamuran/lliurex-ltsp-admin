var section="MirrorManager"
var status="available";

function DisplayMirrorOptions(mirror_installed, mirror_abstract,pool_ok, date){
    
    DivAbstract="<div class='MirrorText'>"+gettext("Mirror Log ")+"</div><div class='abstract'>"+mirror_abstract+"</div>"
    
    if (mirror_installed=="available") {
        DivDate="<div class='MirrorText'>"+gettext("Last Update: ")+"</div><div class='MirrorInfo'>"+date+"</div>"
        DivStatus="<div class='MirrorText'>"+gettext("Mirror Status: ")+"</div><div class='MirrorInfo'>"+mirror_installed+"</div>"
        MirrorButton="<div><div class='BtMirror' id='UpdateMirror'><div>"+gettext("Update Mirror")+"</div></div>";
        MirrorBtText="<div class='BtMirrorText'>"+gettext("Press on Update Mirror to udate Packages in the server mirror.")+"</div>"
    } else   {
        DivDate="<div class='MirrorText'>"+gettext("Last Update: ")+"</div><div class='MirrorInfo'>"+mirror_installed+"</div>"
        DivStatus="<div class='MirrorText'>"+gettext("Mirror Status: ")+"</div><div class='MirrorInfo'>"+mirror_installed+"</div>"
        MirrorButton="<div class='BtMirror' id='InstallMirror'>"+gettext("Install Mirror")+"</div>";
        MirrorBtText="<div class='BtMirrorText'>"+gettext("Press on Install Mirror to install a clean copy from lliurex.net")+"</div>"        
    }

    if (pool_ok=='True') {
        DivCheck="<div class='MirrorText'>"+gettext("Mirror Health: </div><div class='MirrorInfo'> Local Mirror is right.</div>")
    }else {
        DivCheck="<div class='MirrorText'>"+gettext("Mirror Health: </div><div class='MirrorInfoError'> Local mirror was updated when LliureX Mirror was updating. Update it to avoid errors.</div>")
    }
    
    

    OutputCommand="<div id='OutputCommand'></div>"
    /*OutputCommand="<div id='OutputCommand' class='OutputCommand'></div>"
    /*OutputText="<div class='MirrorText'>"+gettext("Command Output:")+"</div>"*/
    OutputText=gettext("Command Output:");
    
    $("#StatusRow").append(DivStatus);
    $("#DataRow").append(DivDate);
    $("#LogRow").append(DivAbstract);
    $("#MirrorSanity").append(DivCheck);
    $("#MirrorButton").append(MirrorButton);
    $("#MirrorBtText").append(MirrorBtText);
    
    $("#CheckMirrorButton").append("Check Mirror");
    //$("#CheckMirrorBtText").append("Check for errors in mirror.");
    
    /*$("#HeaderOutput").append(OutputText);
    $("#Output").append(OutputCommand);*/
    
    
    }


// Event Handlers
// Handle events on page to python

/*Element.addMethods({
  redraw: function(element){
    element = $(element);
    var n = document.createTextNode(' ');
    element.appendChild(n);
    (function(){n.parentNode.removeChild(n)}).defer();
    return element;
  }
});
*/

function add_text_to_output(text) {
    $("#OutputCommand").hide();
    //alert(text)
    $("#OutputCommand").append("<p>"+decodeURIComponent(text)+"</p>");
    console.log("<p>"+decodeURIComponent(text)+"</p>");
    
    $("#OutputCommand").show();
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
     $("#OutputCommand").append("<p id='lastline'>"+progress+"</p>");
     $("#OutputCommand").animate({scrollTop: $("#OutputCommand")[0].scrollHeight});
    }

}

function BindMirrorEventHandlers() {
    $("#UpdateMirror").bind('click', function( event ){
        location.href='ltsp://UpdateMirrorCommand';
        
    });

    $("#InstallMirror").bind('click', function( event ){
        location.href='ltsp://UpdateMirrorCommand';
    });
}

function setStatus(newstatus){
    status=newstatus;
}

$(document).ready(function() {
    // Bind events with actions
    
    mirror_installed=getUrlVar('mirror_installed');
    mirror_abstract=getUrlVar('mirror_abstract');
    mirror_date=getUrlVar('mirror_date');
    pool_ok=getUrlVar('pool_ok');
    
    srv_ip=getUrlVar('srv_ip');
    
    date=new Date(mirror_date*1000)
    
    $("#bottom").append("<span>"+gettext("Connected to server: ")+srv_ip+"</span>");

    /*$("#CheckMirrorButton").click(function(){
        $.xmlrpc({
            url: 'https://'+srv_ip+':9779',
            methodName: 'check_mirror',
            params: ['', "LliurexMirrorNonGtk"],
            success: mensaje,
            error: function(jqXHR, status, error) { alert(response['msg'])}
        });

    });*/
    
    
    DisplayMirrorOptions(mirror_installed, decodeURIComponent(mirror_abstract), pool_ok, date);
    BindMirrorEventHandlers();

    
});


function mensaje(response,status,jqXHR){
	alert(response[0]);
}



// Event Dispatchers
// Functions called from python