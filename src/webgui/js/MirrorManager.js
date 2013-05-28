
function DisplayMirrorOptions(mirror_installed, mirror_abstract, date){
    
    DivAbstract="<div class='MirrorText'>"+gettext("Mirror Log: ")+"</div><div class='abstract'>"+mirror_abstract+"</div>"
    
    if (mirror_installed=="available") {
        DivDate="<div class='MirrorText'>"+gettext("Last Update: ")+"</div><div class='MirrorInfo'>"+date+"</div>"
        DivStatus="<div class='MirrorText'>"+gettext("Mirror Status: ")+"</div><div class='MirrorInfo'>"+mirror_installed+"</div>"
        MirrorButton="<div><div class='BtMirror' id='UpdateMirror'><div>"+gettext("Update Mirror")+"</div></div>";
        MirrorBtText="<div class='BtMirrorText'>"+gettext("Press on Update Mirror to udate Packages in the local mirror.")+"</div>"
    } else   {
        DivDate="<div class='MirrorText'>"+gettext("Last Update: ")+"</div><div class='MirrorInfo'>"+mirror_installed+"</div>"
        DivStatus="<div class='MirrorText'>"+gettext("Mirror Status: ")+"</div><div class='MirrorInfo'>"+mirror_installed+"</div>"
        MirrorButton="<div class='BtMirror' id='InstallMirror'>"+gettext("Install Mirror")+"</div>";
        MirrorBtText="<div class='BtMirrorText'>"+gettext("Press on Install Mirror to install a clean copy from lliurex.net")+"</div>"
        
        }
    OutputCommand="<div id='OutputCommand'></div>"
    /*OutputCommand="<div id='OutputCommand' class='OutputCommand'></div>"
    /*OutputText="<div class='MirrorText'>"+gettext("Command Output:")+"</div>"*/
    OutputText=gettext("Command Output:");
    
    $("#StatusRow").append(DivStatus);
    $("#DataRow").append(DivDate);
    $("#LogRow").append(DivAbstract);
    $("#MirrorButton").append(MirrorButton);
    $("#MirrorBtText").append(MirrorBtText);
    $("#HeaderOutput").append(OutputText);
    $("#Output").append(OutputCommand);
    
    
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


function BindMirrorEventHandlers() {
    $("#UpdateMirror").bind('click', function( event ){
        location.href='ltsp://UpdateMirrorCommand';
        
    });

    $("#InstallMirror").bind('click', function( event ){
        //location.href='ltsp://login';
        alert("install");
    });
}

$(document).ready(function() {
    // Bind events with actions
    
    mirror_installed=getUrlVar('mirror_installed');
    mirror_abstract=getUrlVar('mirror_abstract');
    mirror_date=getUrlVar('mirror_date');
    
    srv_ip=getUrlVar('srv_ip');
    
    date=new Date(mirror_date*1000)
    
    $("#bottom").append("<span>"+gettext("Connected to server: ")+srv_ip+"</span>");
    
    DisplayMirrorOptions(mirror_installed, decodeURIComponent(mirror_abstract), date);
    BindMirrorEventHandlers();

    
});


// Event Dispatchers
// Functions called from python



