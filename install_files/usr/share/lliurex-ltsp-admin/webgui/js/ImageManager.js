var srv_ip="unknown"
var status="available";
var section="ImageManager"
var ErrorMessage=new Array();


function parseData(data) {
    return data.getDate()+"/"+(data.getMonth()+1)+"/"+data.getFullYear();
}

function DisplayImageWindow(){
    $("#ImageManagerContainer").css("display", "block");
    for (var i=0;i<imageData.images.length;i++){    
    
    if(imageData.images[i].installed!=null){
        //if (imageData.images[i].installed)
        today=new Date();
        img_date=new Date(imageData.images[i].installed*1000); // #mm / dd / yy
                        
        if (((today-img_date)/86400000)>30) {
            UpdatedImage="<div style='width:100%;clear:both; float:left'><img src='images/check_old.png' /></div>\
                 <div style='width:100%;clear:both; float:left; color: #ff3333'>Actualitzat el "+parseData(img_date)+"</div>";
            Updateable="Updateable"
        } else
            {
                UpdatedImage="<div style='width:100%;clear:both; float:left'><img src='images/check.png' /></div>\
                 <div style='width:100%;clear:both; float:left'>Actualitzat el "+parseData(img_date)+"</div>";
                Updateable=""
            }
        ItemList="<div class='ImageRow'> \
                <div class='ImageImage'><img src='images/"+imageData.images[i].img+"' /></div> \
                <div class='ImageDetail'> \
                    <div class='ImageName'>"+imageData.images[i].name+"<span class='llx-version'>"+imageData.images[i].lliurex_version+"</span></div>\
                    <div class='ImageDesc' onclick=showDescription("+i+")>"+imageData.images[i].desc.substring(0, 80)+"...</div>\
                    <div class='ButtonList'> \
                        <div class='ButtonSel Install' id='install:"+imageData.images[i].id+"'>"+gettext("Install")+"</div>\
                        <!--div class='Button Update "+Updateable+"' id='update:"+imageData.images[i].id+"'>"+gettext("Update")+"</div-->\
                        <div class='Button Adv' id='adv:"+imageData.images[i].id+"'>"+gettext("Advanced")+"</div>\
                        <div class='Button DeleteSel' id='delete:"+imageData.images[i].id+"'>"+gettext("Delete")+"</div>\
                        <div class='Button Export' id='export:"+imageData.images[i].id+"'>"+gettext("Export")+"</div>\
                    </div>\
                </div>\
                <div class='ImageStatus'> "+UpdatedImage+"\
                </div> \
                 \
            </div>";
    }else{
        if (imageData.images[i].errorcode!=null) {
              ErrorMessage[imageData.images[i].errorcode+i]=imageData.images[i].errormsg;

        if (imageData.images[i].errortype=="ERROR") {        
            errorDescription='Error';
            ErrorLine="<div onclick='MyAlert(ErrorMessage[imageData.images["+i+"].errorcode+"+i+"],errorDescription)' class='imgerror'><img src='images/error.png' /></div>\
            <div style='width:100%;clear:both; float:left; color: #ff3333'>Error. Click for details.</div>";

              /*ErrorLine="<div onclick='alert(ErrorMessage[imageData.images["+i+"].errorcode+"+i+"])' class='imgerror'><img src='images/error.png' /></div>\
                 <div style='width:100%;clear:both; float:left; color: #ff3333'>Error. Click for details.</div>";
              */

            ItemList="<div class='ImageRow'> \
                <div class='ImageImage'><img src='images/"+imageData.images[i].img+"' /></div> \
                <div class='ImageDetail'> \
                    <div class='ImageName'>"+imageData.images[i].name+"</div>\
                    <div class='ImageDesc' onclick=showDescription("+i+")>"+imageData.images[i].desc.substring(0, 80)+"...</div>\
                    <div class='ButtonList'> \
                        <div class='ButtonSel Install' id='install:"+imageData.images[i].id+"'>"+gettext("Install")+"</div>\
                        <!--div class='ButtonSel Update' id='update:"+imageData.images[i].id+"'>"+gettext("Update")+"</div-->\
                        <div class='ButtonSel Adv' id='adv:"+imageData.images[i].id+"'>"+gettext("Advanced")+"</div>\
                        <div class='Button DeleteSel Updateable' id='delete:"+imageData.images[i].id+"'>"+gettext("Delete")+"</div>\
                        <div class='ButtonSel Export' id='export:"+imageData.images[i].id+"'>"+gettext("Export")+"</div>\
                    </div>\
                </div>\
                <div class='ImageStatus'>"+ErrorLine+" \
                </div> \
            </div>";
        } else{
        // IT IS A WARNING
            errorDescription='Warning';
            Updateable="Updateable"
            ErrorLine="<div onclick='MyAlert(ErrorMessage[imageData.images["+i+"].errorcode+"+i+"],errorDescription)' class='imgerror'><img src='images/warning.png' /></div>\
            <div style='width:100%;clear:both; float:left; color: #aaaa11'>Warning. Click for details.</div>";

              /*ErrorLine="<div onclick='alert(ErrorMessage[imageData.images["+i+"].errorcode+"+i+"])' class='imgerror'><img src='images/error.png' /></div>\
                 <div style='width:100%;clear:both; float:left; color: #ff3333'>Error. Click for details.</div>";
              */

            ItemList="<div class='ImageRow'> \
                <div class='ImageImage'><img src='images/"+imageData.images[i].img+"' /></div> \
                <div class='ImageDetail'> \
                    <div class='ImageName'>"+imageData.images[i].name+"</div>\
                    <div class='ImageDesc' onclick=showDescription("+i+")>"+imageData.images[i].desc.substring(0, 80)+"...</div>\
                    <div class='ButtonList'> \
                        <div class='ButtonSel Install' id='install:"+imageData.images[i].id+"'>"+gettext("Install")+"</div>\
                        <!--div class='Button Update "+Updateable+"' id='update:"+imageData.images[i].id+"'>"+gettext("Update")+"</div-->\
                        <div class='Button Adv' id='adv:"+imageData.images[i].id+"'>"+gettext("Advanced")+"</div>\
                        <div class='Button DeleteSel Updateable' id='delete:"+imageData.images[i].id+"'>"+gettext("Delete")+"</div>\
                        <div class='Button Export' id='export:"+imageData.images[i].id+"'>"+gettext("Export")+"</div>\
                    </div>\
                </div>\
                <div class='ImageStatus'>"+ErrorLine+" \
                </div> \
            </div>";
            }


        } else {

        ErrorLine=""
        
        ItemList="<div class='ImageRow'> \
                <div class='ImageImage'><img src='images/"+imageData.images[i].img+"' /></div> \
                <div class='ImageDetail'> \
                    <div class='ImageName'>"+imageData.images[i].name+"</div>\
                    <div class='ImageDesc' onclick=showDescription("+i+")>"+imageData.images[i].desc.substring(0, 80)+"...</div>\
                    <div class='ButtonList'> \
                        <div class='Button Install' id='install:"+imageData.images[i].id+"'>"+gettext("Install")+"</div>\
                        <!--div class='ButtonSel Update' id='update:"+imageData.images[i].id+"'>"+gettext("Update")+"</div-->\
                        <div class='ButtonSel Adv' id='adv:"+imageData.images[i].id+"'>"+gettext("Advanced")+"</div>\
                        <div class='ButtonSel DeleteSel' id='delete:"+imageData.images[i].id+"'>"+gettext("Delete")+"</div>\
                        <div class='ButtonSel Export' id='export:"+imageData.images[i].id+"'>"+gettext("Export")+"</div>\
                    </div>\
                </div>\
                <div class='ImageStatus'>"+ErrorLine+" \
                </div> \
            </div>";
    }}
    $("#content").append(ItemList);
    
    /*$("#desc"+i).bind('click', function() {
        console.log("tralari");
        /*$( "#dialog" ).dialog();
        $("#dialog").append("<p>"+imageData.images[i].desc+"</p>")
        $("#dialog").show();        * /
    });*/
    
        
    }
    $(".Button").bind('click', function(){
        // NOTA: COM A id, UTILITZAR EL META !!!!!!!
        console.log("You pressed on " +this.id);
        var command=this.id.split(":")[0];
        var imageid=this.id.split(":")[1];
        
        $("#helptip").css("display", "none");

        
        switch (command) {
            case "install":
                console.log("You pressed on install ");
                
                title="Install a new Client"
                description="<p>"+gettext("You are going to install a new client based on ")+getDescForId(imageid)+".</p>";
                description=description+"<p>"+gettext("LliureX LTSP will get a lot of packages from mirror, and it will be a long process. So, be patient, please.")+"</p>";
                btText="I'll be patient, let's Install!"
                action='ltsp://CreateNewClient/'+imageid;
                DisplayConfirmWindow(title, description, btText, action, command)
                //location.href='ltsp://CreateNewClient/'+imageid;
                break;
            case "update":
                /* Deprecadet case: Use lliurex-up from advanced!! */

                console.log("You pressed on update ");
                title="Updating Client"
                description="<p>"+gettext("You are going to update a client based on ")+getDescForId(imageid)+".</p>";
                description=description+"<p>"+gettext("LliureX LTSP will update all the packages in the image and will regenerate it. It may take a while. Be patient, please.")+"</p>";
                btText="I'll be patient, Update it!"
                action='ltsp://UpdateImageClient/'+imageid;
                DisplayConfirmWindow(title, description, btText, action, command)
                //location.href='ltsp://UpdateImageClient/'+imageid;
                break;
            case "adv":
                console.log("You pressed on Advanced ");
                location.href='ltsp://ImageAdvanced/'+imageid;

                break;
            case "delete":
                console.log("You pressed on delete ");
                description="<p>"+gettext("You are going to deleta a client image based on ")+getDescForId(imageid)+".</p>";
                description=description+"<p>"+gettext("It will destroy this image client (the .img file and the chroot folder), and clients won't be able to start with this image never more. Be carefull with this option, please.")+"</p>";
                title="Delete a Client"
                btText="I'm sure, delete it!"
                action='ltsp://DeleteClient/'+imageid;
                DisplayConfirmWindow(title, description, btText, action, command)
                // WARNING!!!!
                /*if (confirm('Are you sure you want to delete this image?')) { 
                    if (confirm('It will delete this image completely... really?')) {
                        if (confirm('This is your last opportunity... Sure?')) {
                            location.href='ltsp://DeleteClient/'+imageid;
                        }
                    }
                }*/
                
                break;
                
        }
        
        //location.href='ltsp://SoftwareManager/'+escape($.toJSON(clientData));        
        
     });
    /*$(".Button").bind('mouseover', function(){
        ----> PRova hover... en css...
        $("#"+this.id).css("box-shadow","0px 0px 5px #ffff00;");
     });*/
}


function DisplayConfirmWindow(title, message, btText, action, btclass) {
    img_flavour="styles/images/llx_pack_desktop.png";

    $("#content").css('display', 'none');
    $("#ImageManagerContainer").css('background-image', 'url(styles/images/caution.png)');
    $("#ImageManagerContainer").css('background-repeat', 'no-repeat');
    $("#ConfirmWindow").css('display', 'block');
    $("#ConfirmWindow").append("<div class='ConfirmTitle'>"+title+"</div>");
    $("#ConfirmWindow").append("<div class='ConfirmMessage'>"+message+"</div>");
    
    img_flavour_div="<div class='img_flavour' style='background-image: url("+img_flavour+")'></div>";
    //$("#ConfirmWindow").append("<div class='ConfirmTitle'>"+title+"</div>");
    $("#ConfirmWindow").append(img_flavour_div);

    switch (btclass) {
        case "install":
            msg=gettext("Creating new client image...")
           $("#ConfirmWindow").append("<div onclick='PerformAction(action, msg)' class='CofirmButton BtInstall'>"+btText+"</div>");
            break;
        case "update":
            msg=gettext("Updating packages in client image...")            
           $("#ConfirmWindow").append("<div onclick='PerformAction(action, msg)' class='CofirmButton BtUpdate'>"+btText+"</div>");
            break;
        case "delete":
            msg=gettext("Removing client image...")
           $("#ConfirmWindow").append("<div onclick='PerformAction(action, msg)' class='CofirmButton BtDelete'>"+btText+"</div>");
            break;
    }
    
    //$("#ConfirmWindow").append(text);


    /*$("#ConfirmButton").bind('click', function() {
        /*location.href=action;* /
        alert(action);
    })*/
    
}


function PerformAction(action, Message) {
    /*
    invoques action in ltsp
    */
    /*if (Message === undefined) Message = "Working...";
    status="working";
    $("#shellheader").append("<span>"+Message+"</span>");
    $("#shellbox").css('display', 'block');*/
    location.href=action;
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


$(document).ready(function() {
    //$("#EmergentMessage").hide();
    
    /* function getUrlVar(uv) {
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

    // Print Help tip

    tiptext=gettext("From Image Manager you'll be able to create (install) thin (or far-thin) \
            clients from the server mirror, update and manage its software. It is strongly \
            recommended to have updated the mirror before install a new client in order to \
            get last versions of all the software.")
    $("#helptip").append(tiptext);

    var clients=getUrlVar('imageData'); // name
    // alert (decodeURIComponent(clients));
    //alert(clients)
    imageData=$.parseJSON(decodeURIComponent(clients));
    //alert(imageData)
        
    srv_ip=getUrlVar('srv_ip'); 
    //rv_ip=getUrlVar('mirror_installed'); // name
    
    $("#ConfirmWindow").css('display', 'none');
    $("#shellbox").css('display', 'none');
    $("#bottom").append("<span>Connected to server: "+srv_ip+"</span>");

    $("#CloseButtonShell").bind('click', function( event ){
        if (status=='available') {
            $('#shellbox').css('display', 'none');
            //$('#WaitingWindow').css('display', 'none');
        } else MyAlert(gettext("LliureX LTSP is working, please, wait and don't close this window!"),gettext("LTSP is Working..."));
        
    })
   
    DisplayImageWindow();

});

function setStatus(newstatus){
    status=newstatus;
}

function getDescForId(imageid){
    switch (imageid) {
        case "client":
            return gettext("Classroom Client");
            break;
        case "desktop":
            return gettext("LliureX Desktop");
            break;
        case "infantil":
            return gettext("LliureX Infantil");
            break;
        case "pime":
            return gettext("LliureX Pime");
            break;
        case "musica":
            return gettext("LliureX Musica");
            break;
    }
    return imageid;
}

function showDescription(id){
    
     title=imageData.images[id].name;
     version=imageData.images[id].lliurex_version;
     text=imageData.images[id].desc;
     image="images/"+imageData.images[id].img;
     //buttons={"ok":{"text":"d'Acord","ReturnValue":"true","image":"images/ok.png"},"ok2":{"text":"d'Acord","ReturnValue":"true","image":"images/ok.png"}};     
     buttons={"ok":{"text":"Cancel·la","ReturnValue":"false","image":"images/cancel.png"},"ok2":{"text":"d'Acord","ReturnValue":"true","image":"images/ok.png"}};
     tip="Prem sobre la finestra per eixir"
     
          
     ShowDialog(title, text, image, buttons, tip, function(response){
        //alert(response);
        });
}