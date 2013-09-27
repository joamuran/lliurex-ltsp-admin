var lastid=0; // To save the last image id
var clientData=new Object();
var classroomsession="gnome"
var classroomtype="thin"
var section="ClientManager"

var timeout="60";
var default_option="localboot";


function DisplayClassroomConfig(){
    //ClassroomConfig

if (classroomsession=="gnome") {
    selected_session_gnome="selected"; selected_session_xfce="";}
else{
    selected_session_gnome=""; selected_session_xfce="selected"; }

if (classroomtype=="fat") {
    selected_type_fat="selected"; selected_type_thin="";}
else{
    selected_type_fat=""; selected_type_thin="selected";}


classroomsession=clientData.default_session
classroomtype=clientData.default_type

ItemClass="<div class='ClassConfigTitle'>"+gettext("Classroom Configuration")+"</div>\
<div class='ClassroomItem'>"+gettext("Use this classroom cliens as:")+"</div>\
        <div>\
       <select class='ClassroomItem' name='ClassroomType' id='ClassroomType'> \
          <option value='thin' "+selected_type_thin+">"+gettext("Thin Client Classroom (recommend)")+"</option> \
          <option value='fat' "+selected_type_fat+">"+gettext("Fat-Thin Client Classroom")+"</option> \
        </select></div> \
        <div class='ClassroomItem' style='float:left; clear:both;'>Default session to use:</div>\
        <div>\
       <select class='ClassroomItem' name='ClassroomSession' id='ClassroomSession'> \
          <option value='gnome' "+selected_session_gnome+">"+gettext("Classic Desktop (Gnome-Classic)")+"</option> \
          <option value='xfce'"+selected_session_xfce+">"+gettext("Alternate Lite Desktop (XFCE)")+"</option> \
        </select></div>\
    <div class='ClassroomItem' style='float:left; clear:both;'>Default boot:</div>\
        <div>\
       <select class='ClassroomItem' name='PXEBoot' id='PXEBoot'> \
          <!--option value='hd' "+selected_session_gnome+">"+gettext("Boot from hard drive")+"</option> \
          <option value='desktop'"+selected_session_xfce+">"+gettext("Boot from LliureX Desktop")+"</option> \
          <option value='client'"+selected_session_xfce+">"+gettext("Boot from LliureX Classroom Client")+"</option--> \
        </select></div></div>\
        <div style='float: left; display: block; clear: both;'><span class='ClassroomItem'>"+gettext("Timeout: ")+"</span><input class='FormInput' id='timeout' type='text' /></div>";
        
    $("#ClassroomConfig").append(ItemClass);

}


function DisplayClients(){
    // Display all clients, with possibility to expand its properties
    
    itemtitle="<div class='ClassConfigTitle' style='margin-left:25px;' >"+gettext("Client Configuration")+"</div>";
    $("#ClientContent").append(itemtitle);

    for (var i=0;i<clientData.clients.length;i++){
        
        // Our clients will be identified by their MAC withou # (strid)
        strid=(clientData.clients[i].mac).toString().replace(/:/g,""); 
        
        if (clientData.clients[i].session=="gnome"){
        ItemSession="<select class='ClientItem' name='SessionSelector' id=sessionselector"+strid+" \
                    onchange='handleChangeSession(this);'> \
                        <option value='gnome' selected>"+gettext("Classic Desktop (Gnome)")+"</option> \
                        <option value='xfce'>"+gettext("Alternate Lite Desktop (XFCE)")+"</option> \
                    </select>";
        } else {
        ItemSession="<select class='ClientItem' name='SessionSelector' id=sessionselector"+strid+" \
                    onchange='handleChangeSession(this);'> \
                        <option value='gnome'>"+gettext("Classic Desktop (Gnome)")+"</option> \
                        <option value='xfce' selected>"+gettext("Alternate Lite Desktop (XFCE)")+"</option> \
                    </select>";
        }
        
        if (clientData.clients[i].fat=="false"){ // True: FatClient; False: Thin Client
        ItemType="<select class='ClientItem' name='TypeSelector'> \
                        <option value='false' selected>"+gettext("Thin Client")+"</option> \
                        <option value='true'>"+gettext("Fat-Thin Client (default)")+"</option> \
                    </select>";
        } else {
        ItemType="<select class='ClientItem' name='TypeSelector'> \
                        <option value='false'>"+gettext("Thin Client")+"</option> \
                        <option value='true' selected>"+gettext("Fat-Thin Client (default)")+"</option> \
                  </select>";}
               
        
        if(clientData.clients[i].autologin=="checked"){            
            ItemLogin="<div class='ClientItem'>"+gettext("Username: ")+"</div><input class='ClientItem' type='text' name='username' id='user"+strid+"' value='"+clientData.clients[i].username+"'></input> \
                    <div class='ClientItem'>"+gettext("Password: ")+"</div><input class='ClientItem' name='password' type='password' id='pass"+strid+"' value='"+clientData.clients[i].userpass+"'></input>";
        } else
            ItemLogin="<div class='ClientItem' disabled>"+gettext("Username: ")+"</div><input name='username' class='ClientItem' type='text' id='user"+strid+"' value='"+clientData.clients[i].username+"' disabled></input> \
                      <div class='ClientItem' disabled>"+gettext("Password: ")+"</div><input name='password' class='ClientItem' type='password' id='pass"+strid+"' value='"+clientData.clients[i].userpass+"' disabled></input>";
            
        
        ItemList="<div class='ClientConfig' id='Client"+strid+"'> \
                    <div class='ClientRow' id='ClientRow"+strid+"'>\
                        <div class='ClientRowArrow' id='ClientRowArrow"+strid+"' onclick='ShowDetails(\""+strid+"\")'> \
                            <img src='styles/images/arrowwhite.png'/></div> \
                            Client: "+clientData.clients[i].mac+" \
                            <div class='ButtonDeleteRight' onclick='handleDeleteClient(\""+strid+"\")'> Delete\
                    </div></div>\
                    <div class='ClientDetails' id='ClientDetails"+strid+"'> \
                      <div class='ClientLine'> \
                        <div class='ClientItem'>"+gettext("Name: ")+"</div><input class='ClientItem' type='text' name='clientname' disabled value='"+clientData.clients[i].name+"'></input>\
                        <div class='ClientItem'>"+gettext("Description: ")+"</div><input class='ClientItem' type='text' name='clientdetails' value='"+clientData.clients[i].desc+"'></input>\
                        </div><div class='ClientLine'> \
                        <div class='ClientItem'> "+gettext("Client Type: ")+" </div> "+ItemType+" \
                        <div class='ClientItem'>"+gettext("Client Session: ")+"</div> "+ItemSession+" \
                        </div><div class='ClientLineInfo' id='sessionline"+strid+"'> \
                        "+gettext("Be careful to have installed LXDE on the client!<br>You can do it through the Advanced Button in the Image Manager.")+"\
                        </div><div class='ClientLine'> \
                        <div class='ClientItem'><input id='check"+strid+"' onchange='handleChange(this);' class='ClientItemCheckBox' type='checkbox' name='autologin' value='autologin' "+clientData.clients[i].autologin+">"+gettext("Autologin")+"</input></div>"+ItemLogin+" \
                      </div> \
                    </div> \
                 </div>";
    
    /*$("#check"+i).bind('change', function(){
        alert("check"+1);
    })*/
    
    $("#ClientContent").append(ItemList);
    lastid=i;
    }
    
    //newItem="<div class='NewClientRow' id='AddRow"+lastid+"' onclick='addNewClient(AddRow"+lastid+"')>Add a new client</div>"
    //LastClientId="addNewClient('AddRow"+lastid+"')";
    //LastClientId="AddRow"+lastid;
    //alert (LastClientId);
    //newItem="<div class='NewClientRow' id='AddRow"+lastid+"'   onclick='addNewClient (LastClientId)'>Add a new client</div>"
    //newItem="<div class='NewClientRow' id='AddRow"+lastid+"'   onclick='addNewClient(LastClientId)'>Add a new client</div>"
    
    //ButtonNew="<div class='Button' onclick='addNewClient()'>"+$.i18n("New Client")+"</div>"
    
    ButtonNew="<div class='Button NewClient' onclick='addNewClient()'>"+gettext("New Client")+"</div>"
    ButtonSave="<div class='Button SaveChanges' onclick='SaveChanges()'>"+gettext("Apply Changes")+"</div>"
    divButtons="<div class='ButtonList'>"+ButtonNew+ButtonSave+"</div>";
        
    $("#AppContainer").append(divButtons);
}


function SaveChanges(){
    // send data to python core to save it and refresh the view
    //alert($.toJSON(clientData));
    
    timeout=$("#timeout").val();
    default_option=$("#PXEBoot").val();
    
    var newClientList=new Object();
    newClientList.clients=new Array();
    
    ClassroomSession= $("[name='ClassroomSession']").val();
    ClassroomType= $("[name='ClassroomType']").val();

    
     $(".ClientDetails").each(function (index) {
        
        var newclientData = new Object();
        
        var mac=$(this).attr('id').substring(13);
        newclientData.mac=mac.substring(0,2)+":"+mac.substring(2,4)+":"+mac.substring(4,6)+":"+
                          mac.substring(6,8)+":"+mac.substring(8,10)+":"+mac.substring(10,12);
        newclientData.name=$(this).find("[name='clientname']").val();
        //alert("name="+newclientData.name);
        newclientData.desc= $(this).find("[name='clientdetails']").val();
        //alert("Details="+newclientData.desc);
        newclientData.fat = $(this).find("[name='TypeSelector']").val();
        //alert("type="+newclientData.type);
        newclientData.session= $(this).find("[name='SessionSelector']").val();
        //alert("session="+newclientData.session);
        newclientData.username = $(this).find("[name='username']").val();
        //alert("username="+newclientData.username);
        newclientData.userpass = $(this).find("[name='password']").val();
        //alert("pass="+newclientData.password);
        var checked=$(this).find("[name='autologin']").is(':checked');
        if (checked) newclientData.autologin = "checked";
        else newclientData.autologin = "unchecked";
        //alert("autologin="+newclientData.autologin);
        newclientData.monitor="auto";
    
        newClientList.clients[newClientList.clients.length]=newclientData;
     })

          
     
    location.href='ltsp://ClientSaveConfig/'+escape($.toJSON(newClientList))+"/"+ClassroomType+"/"+ClassroomSession+"/"+timeout+"/"+default_option;

    
    
    
}


function addNewClient(){
    // Form to add a new client to the client list
    newid=lastid+1;
    
    ItemSession="<select class='ClientItem' name='SessionSelector' id='sessionselectornew'\
                onchange='handleChangeSession(this);'> \
                        <option value='gnome' selected>"+gettext("Classic Desktop (Gnome)")+"</option> \
                        <option value='xfce'>"+gettext("Alternate Lite Desktop (XFCE)")+"</option> \
                    </select>";
    
    ItemType="<select class='ClientItem' id='newclienttype'> \
                        <option value='false' selected>"+gettext("Thin Client")+"</option> \
                        <option value='true'>"+gettext("Fat-Thin Client (default)")+"</option> \
                    </select>";

    ItemLogin="<div class='ClientItem' disabled>"+gettext("Username: ")+"</div><input class='ClientItem' \
    type='text' id='newclientlogin' value='' disabled></input> \
    <div class='ClientItem'>"+gettext("Password: ")+"</div><input class='ClientItem' name='password' \
    type='password' id='newpass' value='' disabled></input>";
    
    dialog="<div id='dialogWindow'> \
          <div id='dialogHeader'>"+gettext("New Client")+"</div> \
          <div id='dialogContent'>\
         <div class='ClientLine'> \
            <div class='ClientItem'>"+gettext("MAC:")+"</div><input class='ClientItem' type='text' id='MACClient'></input>\
            <div class='ClientItem'>"+""+"</div>\
            <div class='dialogButton' onclick='getMacFromClipboard()'>"+gettext("Import MAC from LTSP Clipboard")+"</div>\
         </div><div class='ClientLine'> \
         <div class='ClientLine'> \
            <div class='ClientItem'>"+gettext("Name: ")+"</div><input class='ClientItem' type='text' id='newclientname' disabled></input>\
            <div class='ClientItem'>"+gettext("Description: ")+"</div><input class='ClientItem' type='text' id='newclientdesc'></input>\
         </div><div class='ClientLine'> \
            <div class='ClientItem'> "+gettext("Client Type: ")+" </div> "+ItemType+" \
            <div class='ClientItem'>"+gettext("Session: ")+"</div> "+ItemSession+" \
            </div><div class='ClientLineInfo' id='sessionlinenew'> \
                        "+gettext("Be careful to have installed LXDE on the client!<br>You can do it through the Advanced Button in the Image Manager.")+"\
         </div><div class='ClientLine'> \
            <div class='ClientItem'>\<input id='newcheck' onchange='handleChange(this);' class='ClientItemCheckBox' type='checkbox' name='autologin' value='autologin'>"+gettext("Autologin")+"</input></div>"+ItemLogin+" \
            </div> \
        </div><div class='dialogListButtons'> \
            <div class='dialogButton' onclick='AddClient()'>"+gettext("Afig el Client")+"</div>\
            <div class='dialogButton' onclick='Cancel()'>"+gettext("Cancel·la")+"</div>\
          </div> </div>"
      
   $("#MessageArea").html(dialog);
   //$("#MessageArea").show();
   $("#MessageArea").fadeIn(300);
    
            
};

function getMacFromClipboard() {
    location.href='ltsp://GetMacFromN4d';
}
function setMac(mac, hostname){
    $("#MACClient").val(mac);
    $("#newclientname").val(hostname);
}


function handleChangeSession(cb){
    id="#sessionline"+cb.id.split("sessionselector")[1];
    if (cb.value=="xfce")
        $(id).css("display", "block");
    else
        $(id).css("display", "none");
    
     //id=sessionselector"+strid+" 
        //alert(cb.id);

    //alert($("#clientsession"));
    
}

function handleChange(cb) {
    //alert(cb.id);
    //alert(cb.id.indexOf("check"));
    if(cb.id.indexOf("check")==0){ // handling change on List of Clients
        id="#user"+cb.id.split("check")[1];
        idpass="#pass"+cb.id.split("check")[1];
       // alert(id);
        if (cb.checked==false) {
            $(id).attr("disabled", true);
            $(idpass).attr("disabled", true);
            }
        else {
            $(id).removeAttr("disabled");
            $(idpass).removeAttr("disabled");
        }
    } else { // handling change on "New Client" Window
        //alert("CB Checked: "+ cb.checked);
        if (cb.checked==false) {
            $("#newclientlogin").attr("disabled", true);
            $("#newpass").attr("disabled", true);
            
        }
        else {
            $("#newclientlogin").removeAttr("disabled");
            $("#newpass").removeAttr("disabled");
        }
    }
}


function handleDeleteClient(strid){
     
     // Find Client on clientData
     id=-1;
     for(i=0;i<clientData.clients.length;i++){
        currentstrid=(clientData.clients[i].mac).toString().replace(/:/g,"");
        console.log("Compare: "+currentstrid+" \n with "+strid+" \n at position "+i);
        if (currentstrid==strid) {
            //alert("Found at position "+i);
            id=i;
            break;
        }
     }
     if (id==-1) return false;
     
     console.log(clientData.clients.length+"-"+id);
          
     title=gettext("Delete Client");
     text=gettext("Do you want to delete the client ")+clientData.clients[id].name+gettext(" with MAC ")+clientData.clients[id].mac;
     image="images/dialog-question.png";
     client=gettext("Client")+strid;
     clientRow=gettext("ClientRow")+strid;
     
     buttons={"cancel":{"text":gettext("Cancel·la"),"ReturnValue":"false","image":"images/cancel.png"},"ok":{"text":gettext("d'Acord"),"ReturnValue":"true","image":"images/ok.png"}};
     
     tip="";
     
     ShowDialog(title, text, image, buttons, tip, function(response){
        if (response) {
                console.log("Deleting id:"+this.id);
                $("#"+client).slideUp(300, function(){
                    $("#"+client).remove();
                })
                
                clientData.clients.splice(this.id,1);
        }
        //else alert("se queda "+client);
        });
     return true;
    }
    
function ShowDetails(name){
    //# Show or hide details about an specific client
    
    //alert(name);
    //alert($("#ClientDetails"+name).length);
        
    if($("#ClientDetails"+name).css("display")=="block")
    {
        $("#ClientDetails"+name).slideUp(300);
        //$("#ClientRowArrow"+i).animate({  borderSpacing: 0 }, {
        $("#ClientRowArrow"+name).animate({  borderSpacing: 0 }, {
            step: function(now,fx) {
              $(this).css('-webkit-transform','rotate('+now+'deg)');
              $(this).css('-moz-transform','rotate('+now+'deg)'); 
            $(this).css('transform','rotate('+now+'deg)');  
            },
            duration:'normal'},'linear');
    }
    else
    {
        $("#ClientDetails"+name).slideDown(300);
        $("#ClientRowArrow"+name).animate({  borderSpacing: 90 }, {
            step: function(now,fx) {
              $(this).css('-webkit-transform','rotate('+now+'deg)');
              $(this).css('-moz-transform','rotate('+now+'deg)'); 
            $(this).css('transform','rotate('+now+'deg)');  
            },
            duration:'normal'},'linear');
    };
}


function AddClient(){
    var sessionname = $('#sessionselectornew').find(":selected").text();
    var sessionid = $('#sessionselectornew').find(":selected").val();
    var sessiontype = $('#newclienttype').find(":selected").val();

    var mac=$("#MACClient").val();
    var clientname=$("#newclientname").val();
    var clientdesc=$("#newclientdesc").val();
    //var autologin=$("#newcheck").is(':checked');
    var username=$('#newclientlogin').val();
    var userpass=$('#newpass').val();

    //var i=lastid+1; // Index of last id added to list
    var autologin='';
    if ($("#newcheck").is(':checked')) autologin='checked';

    
    if ($("#MACClient").val()=='') alert(gettext("MAC can not be empty"));
    else if (ExistsMac(mac)) alert(gettext("MAC already exists"));
    else if (!ValidaMAC($("#MACClient").val())) alert (gettext("MAC format not valid"));
    else {
        //alert($("#MACClient").val());
        // Adding a new Client
        strid=mac.replace(/:/g,"");
        
        
        if (sessionid=="gnome"){
        ItemSession="<select class='ClientItem'> \
                        <option value='gnome' selected>"+gettext("Classic Desktop (Gnome)")+"</option> \
                        <option value='xfce'>"+gettext("Alternate Lite Desktop (XFCE)")+"</option> \
                    </select>";
        } else {
        ItemSession="<select class='ClientItem'> \
                        <option value='gnome'>"+gettext("Classic Desktop (Gnome)")+"</option> \
                        <option value='xfce' selected>"+gettext("Alternate Lite Desktop (XFCE)")+"</option> \
                    </select>";
        }

        if (sessiontype=="false"){ // True: FatClient; False: Thin Client
        ItemType="<select class='ClientItem' name='TypeSelector'> \
                        <option value='false' selected>"+gettext("Thin Client")+"</option> \
                        <option value='true'>"+gettext("Fat-Thin Client (default)")+"</option> \
                    </select>";
        } else {
        ItemType="<select class='ClientItem' name='TypeSelector'> \
                        <option value='false'>"+gettext("Thin Client")+"</option> \
                        <option value='true' selected>"+gettext("Fat-Thin Client (default)")+"</option> \
                  </select>";}

        
        ItemLogin="<div class='ClientItem'>"+gettext("Username: ")+"</div>\
        <input class='ClientItem' type='text' id='user"+strid+"' value='"+username+"' disabled></input> \
        <div class='ClientItem'>"+gettext("Password: ")+"</div>\
        <input class='ClientItem' name='password' \
        type='password' id='newpass' value='"+userpass+"' disabled></input>"
    
                
        ItemList="<div class='ClientConfig' id='Client"+strid+"' > \
                    <div class='NewClientRow' id='ClientRow"+strid+"'>\
                        <div class='ClientRowArrow' id='ClientRowArrow"+strid+"' onclick='ShowDetails(\""+strid+"\")'> \
                            <img src='styles/images/arrowwhite.png'/></div> \
                            Client: "+mac+" \
                            <div class='ButtonDeleteRight' onclick='handleDeleteClient(\""+strid+"\")'> Delete\
                            </div></div>\
                    <div class='ClientDetails' id='ClientDetails"+strid+"'> \
                      <div class='ClientLine'> \
                        <div class='ClientItem'>"+gettext("Name: ")+"</div><input class='ClientItem' type='text' value='"+clientname+"' disabled></input>\
                        <div class='ClientItem'>"+gettext("Description: ")+"</div><input class='ClientItem' type='text' value='"+clientdesc+"' disabled></input>\
                        </div><div class='ClientLine'> \
                        <div class='ClientItem'> "+gettext("Client Type: ")+" </div> "+ItemType+" \
                        <div class='ClientItem'>Session: </div> "+ItemSession+" \
                        </div><div class='ClientLine'> \
                        <div class='ClientItem'><input id='check"+strid+"' onchange='handleChange(this);' class='ClientItemCheckBox' type='checkbox' name='autologin' value='autologin' "+autologin+" disabled>"+gettext("Autologin")+"</input></div>"+ItemLogin+" \
                      </div> \
                    </div> \
                 </div>";
    
        
    $("#ClientContent").append(ItemList);
        
    newClient={"mac": mac, "name": clientname, "desc": clientdesc,  "session": sessionname,
         "monitor":"auto", "autologin":autologin, "username":username, "userpass":userpass};
    
    clientData.clients.push(newClient);
    //clientData.clients[i]=newClient;
    //alert(clientData.clients[i]);
    // Adding data to clientData
    /*clientData.clients[i].name=name;
    clientData.clients[i].mac=mac;
    clientData.clients[i].desc=desc;
    clientData.clients[i].session=sessionname;
    clientData.clients[i].monitor="";
    clientData.clients[i].autologin=autologin;
    clientData.clients[i].username=username;*/
    
    
    
    
    
    
    
    
            
    lastid++;    
    
    $("#MessageArea").fadeOut(300, function(){
        $("#MessageArea").empty();
    })
        
    }
 
}

function Cancel(){
    $("#MessageArea").fadeOut(300, function(){
        $("#MessageArea").empty();
    })
}

function ValidaMAC(mac) 
 {
  var RegExPattern = /^[0-9a-fA-F:]+$/;
  if (!(mac.match(RegExPattern)) || mac.length != 17) 
   return false;
  else
   return true;
 }

function ExistsMac(mac){
    for (i=0; i<clientData.clients.length ;i++)
        if (clientData.clients[i].mac==mac) return true;
    // elsewhere return false
    return false;
}

$(document).ready(function() {
       
    var clients=getUrlVar('clientlist'); // name

    clientData=$.parseJSON(decodeURIComponent(clients));

    classroomsession=clientData.default_session
    classroomtype=clientData.default_type
        
    srv_ip=getUrlVar('srv_ip');     
    $("#bottom").append("<span>Connected to server: "+srv_ip+"</span>");
    DisplayClassroomConfig();
    DisplayClients();

    $.xmlrpc({
	url: 'https://'+srv_ip+':9779',
        methodName: 'getImageList',
	params: ['', "n4dPXEManager"],
        success: function(response,status,jqXHR){
                //alert(response[0]['timeout']);
                $("#timeout").val(response[0]['timeout']);
                timeout=response[0]['timeout'];
                for (i in response[0]['images']) {
                    /*alert(response[0]['images'][i]);*/
                    option=response[0]['images'][i];
                    if (option==response[0]['default']) {
                        $("#PXEBoot").append("<option selected='selected' value='"+option+"'>"+getCompleteLabel(option)+"</option>");
                        
                        default_option=option;
                    } else $("#PXEBoot").append("<option value='"+option+"'>"+getCompleteLabel(option)+"</option>");
                }         
            },
	error: function(jqXHR, status, error) { alert("Error: "+error[0])}
    }); 
    
    // Bind events with actions
    //BindEventHandlers();
});

function getCompleteLabel(option) {
    switch (option) {
        case "localboot":
            return gettext("Arranca des del disc dur");
            break;
        case "llx-client":
            return gettext("Classroom Client");
            break;
        case "llx-desktop":
            return gettext("LliureX Desktop");
            break;
        case "llx-infantil":
            return gettext("LliureX Infantil");
            break;
        case "llx-musica":
            return gettext("LliureX Musica");
            break;
           case "llx-pime":
            return gettext("LliureX Pime");
            break;
        case "llx-lite":
            return gettext("LliureX Lite");
            break;
        
    }
    return (option);
    
}

// Event Dispatchers
// Functions called from python


// Event Handlers
// Handle events on page to python


