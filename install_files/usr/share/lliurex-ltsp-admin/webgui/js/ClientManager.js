
var lastid=0; // To save the last image id
var clientData=new Object();


function DisplayClients(){
    // Display all clients, with possibility to expand its properties
    
    for (var i=0;i<clientData.clients.length;i++){
        
        // Our clients will be identified by their MAC withou # (strid)
        strid=(clientData.clients[i].mac).toString().replace(/:/g,""); 
        
        if (clientData.clients[i].session=="gnome"){
        ItemSession="<select class='ClientItem' name='SessionSelector' id=sessionselector"+strid+" \
                    onchange='handleChangeSession(this);'> \
                        <option value='gnome' selected>"+gettext("Gnome Classic")+"</option> \
                        <option value='lxde'>"+gettext("LXDE, light Deskton")+"</option> \
                    </select>";
        } else {
        ItemSession="<select class='ClientItem' name='SessionSelector' id=sessionselector"+strid+" \
                    onchange='handleChangeSession(this);'> \
                        <option value='gnome'>"+gettext("Gnome Classic")+"</option> \
                        <option value='lxde' selected>"+gettext("LXDE, light Desktop")+"</option> \
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
    
    var newClientList=new Object();
    newClientList.clients=new Array();
    
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

     
     
     
     

    location.href='ltsp://ClientSaveConfig/'+escape($.toJSON(newClientList));

    
    
    
}


function addNewClient(){
    // Form to add a new client to the client list
    newid=lastid+1;
    
    ItemSession="<select class='ClientItem' name='SessionSelector' id='sessionselectornew'\
                onchange='handleChangeSession(this);'> \
                        <option value='gnome' selected>"+gettext("Gnome Classic")+"</option> \
                        <option value='lxde'>"+gettext("LXDE, light Desktop")+"</option> \
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
    if (cb.value=="lxde")
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
                        <option value='gnome' selected>"+gettext("Gnome Classic")+"</option> \
                        <option value='lxde'>"+gettext("LXDE, light Desktop")+"</option> \
                    </select>";
        } else {
        ItemSession="<select class='ClientItem'> \
                        <option value='gnome'>"+gettext("Gnome Classic")+"</option> \
                        <option value='lxde' selected>"+gettext("LXDE, light Desktop")+"</option> \
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
    
    var clients=getUrlVar('clientlist'); // name
    // alert (decodeURIComponent(clients));
    //alert(clients)
    clientData=$.parseJSON(decodeURIComponent(clients));
        
    

    DisplayClients();

    // Bind events with actions
    //BindEventHandlers();
});

// Event Dispatchers
// Functions called from python


// Event Handlers
// Handle events on page to python


