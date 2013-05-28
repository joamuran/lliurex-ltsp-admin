
var lastid=0; // To save the last image id


/*
var clientData = {"clients": [
        {"mac": "11:22:33:44:55:66",
         "name": "PC01",
         "desc": "ordinador 1",
         "session":"gnome",
         "monitor":"auto",
         "autologin":"true",
         "username":"lliurex"},

*/
function DisplayClients(){
    for (var i=0;i<clientData.clients.length;i++){
        
        if (clientData.clients[i].session=="gnome"){
        ItemSession="<select class='ClientItem'> \
                        <option value='gnome' selected>"+gettext("Gnome Classic")+"</option> \
                        <option value='lxde'>"+gettext("LXDE, escriptori lleuger")+"</option> \
                    </select>";
        } else {
        ItemSession="<select class='ClientItem'> \
                        <option value='gnome'>"+gettext("Gnome Classic")+"</option> \
                        <option value='lxde' selected>"+gettext("LXDE, escriptori lleuger")+"</option> \
                    </select>";
        }
        
        
        if(clientData.clients[i].autologin=="checked"){
            ItemLogin="<div class='ClientItem'>"+gettext("Username: ")+"</div><input class='ClientItem' type='text' id='user"+i+"' value='"+clientData.clients[i].username+"'></input>"
        } else
            ItemLogin="<div class='ClientItem' disabled>"+gettext("Username: ")+"</div><input class='ClientItem' type='text' id='user"+i+"' value='"+clientData.clients[i].username+"' disabled></input>"
        
        
        strid=(clientData.clients[i].mac).toString().replace(/:/g,"");
        
        ItemList="<div class='ClientConfig' id='Client"+i+"'> \
                    <div class='ClientRow' id='ClientRow"+i+"'>\
                        <div class='ClientRowArrow' id='ClientRowArrow"+i+"' onclick='ShowDetails("+strid.toString()+","+i.toString()+")'> \
                            <img src='styles/images/arrowwhite.png'/></div> \
                            Client: "+clientData.clients[i].mac+" \
                            <div class='ButtonDeleteRight' onclick='handleDeleteClient("+i+")'> Delete\
                    </div></div>\
                    <div class='ClientDetails' id='ClientDetails"+strid+"'> \
                      <div class='ClientLine'> \
                        <div class='ClientItem'>"+gettext("Name: ")+"</div><input class='ClientItem' type='text' value='"+clientData.clients[i].name+"'></input>\
                        <div class='ClientItem'>"+gettext("Description: ")+"</div><input class='ClientItem' type='text' value='"+clientData.clients[i].desc+"'></input>\
                        </div><div class='ClientLine'> \
                        <div class='ClientItem'>Session: </div> "+ItemSession+" \
                        <div class='ClientItem'><input id='check"+i+"' onchange='handleChange(this);' class='ClientItemCheckBox' type='checkbox' name='autologin' value='autologin' "+clientData.clients[i].autologin+">"+gettext("Autologin")+"</input></div>"+ItemLogin+" \
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
    alert($.toJSON(clientData));
    
}


function addNewClient(){
    newid=lastid+1;
    
    ItemSession="<select class='ClientItem' id='newclientsession'> \
                        <option value='gnome' selected>"+gettext("Gnome Classic")+"</option> \
                        <option value='lxde'>"+gettext("LXDE, escriptori lleuger")+"</option> \
                    </select>";
    
    //ItemLogin="<div class='ClientItem' disabled>"+gettext("Username: ")+"</div><input class='ClientItem' type='text' id='user"+newid+"' value='' disabled></input>";
    ItemLogin="<div class='ClientItem' disabled>"+gettext("Username: ")+"</div><input class='ClientItem' type='text' id='newclientlogin' value='' disabled></input>";
    
    dialog="<div id='dialogWindow'> \
          <div id='dialogHeader'>"+gettext("New Client")+"</div> \
          <div id='dialogContent'>\
         <!--div id='dialogImg'><img src='"+""+"' /></div--> \
         <div class='ClientLine'> \
            <div class='ClientItem'>"+gettext("MAC:")+"</div><input class='ClientItem' type='text' id='MACClient'></input>\
            <div class='ClientItem'>"+""+"</div>\
            <div class='dialogButton' onclick='alert(\'Getting MAC'\)'>"+gettext("Importa MAC del portaretalls LTSP")+"</div>\
         </div><div class='ClientLine'> \
         <div class='ClientLine'> \
            <div class='ClientItem'>"+gettext("Name: ")+"</div><input class='ClientItem' type='text' id='newclientname'></input>\
            <div class='ClientItem'>"+gettext("Description: ")+"</div><input class='ClientItem' type='text' id='newclientdesc'></input>\
         </div><div class='ClientLine'> \
            <div class='ClientItem'>"+gettext("Session: ")+"</div> "+ItemSession+" \
         </div><div class='ClientLine'> \
            <div class='ClientItem'>\<input id='newcheck' onchange='handleChange(this);' class='ClientItemCheckBox' type='checkbox' name='autologin' value='autologin'>"+gettext("Autologin")+"</input></div>"+ItemLogin+" \
            </div> \
        </div><div class='ClientLine'> \
            <div class='dialogButton' onclick='AddClient()'>"+gettext("Afig el Client")+"</div>\
            <div class='dialogButton' onclick='Cancel()'>"+gettext("Cancel·la")+"</div>\
          </div> </div>"
      
   $("#MessageArea").html(dialog);
   //$("#MessageArea").show();
   $("#MessageArea").fadeIn(300);
    
    /*
            //alert("Adding client: "+newid);
            
            ItemSession="<select class='ClientItem'> \
                        <option value='gnome' selected>Gnome Classic</option> \
                        <option value='lxde'>LXDE, escriptori lleuger</option> \
                    </select>";
            
            element="<div class='ClientDetails' id='ClientDetails"+newid+"'> \
                      <div class='ClientLine'> \
                        <div class='ClientItem'>Name:</div><input class='ClientItem' type='text'></input>\
                        <div class='ClientItem'>Description: </div><input class='ClientItem' type='text'></input>\
                        </div><div class='ClientLine'> \
                        <div class='ClientItem'>Session: </div> "+ItemSession+" \
                        <div class='ClientItem'>\<input id='check"+newid+"' onchange='handleChange(this);' class='ClientItemCheckBox' type='checkbox' name='autologin' value='autologin'>Autologin</input></div>"+ItemLogin+" \
                      </div> \
                    </div>";
            
            //alert("#"+NewRow);
            //$("#"+NewRow).append(element);
            $("#AddRow2").append(element);
    */            
            
};

function handleChange(cb) {
    //alert(cb.id.indexOf("check"));
    if(cb.id.indexOf("check")==0){ // handling change on List of Clients
        id="#user"+cb.id.split("check")[1];
        if (cb.checked==false) $(id).attr("disabled", true);
        else $(id).removeAttr("disabled");
    } else { // handling change on "New Client" Window
        //alert("CB Checked: "+ cb.checked);
        if (cb.checked==false) $("#newclientlogin").attr("disabled", true);
        else $("#newclientlogin").removeAttr("disabled");
    }
}


function handleDeleteClient(id){
     title=gettext("Delete Client");
     text=gettext("Do you want to delete the client ")+clientData.clients[id].name+gettext(" with MAC ")+clientData.clients[id].mac;
     image="images/dialog-question.png";
     client=gettext("Client")+id;
     clientRow=gettext("ClientRow")+id;
     
     buttons={"cancel":{"text":gettext("Cancel·la"),"ReturnValue":"false","image":"images/cancel.png"},"ok":{"text":gettext("d'Acord"),"ReturnValue":"true","image":"images/ok.png"}};
     
     tip="";
     
     ShowDialog(title, text, image, buttons, tip, function(response){
        if (response) {
            
                $("#"+client).slideUp(300);
                clientData.clients.splice(id,1);
        }
        //else alert("se queda "+client);
        });
    }
    
function ShowDetails(name,i){
    alert("123");
    /*alert(name);
    alert($("#ClientDetails"+name).length);
        
    if($("#ClientDetails"+name).css("display")=="block")
    {
        $("#ClientDetails"+name).slideUp(300);
        $("#ClientRowArrow"+i).animate({  borderSpacing: 0 }, {
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
        $("#ClientRowArrow"+i).animate({  borderSpacing: 90 }, {
            step: function(now,fx) {
              $(this).css('-webkit-transform','rotate('+now+'deg)');
              $(this).css('-moz-transform','rotate('+now+'deg)'); 
            $(this).css('transform','rotate('+now+'deg)');  
            },
            duration:'normal'},'linear');
    };*/
}


function AddClient(){
    var sessionname = $('#newclientsession').find(":selected").text();
    var sessionid = $('#newclientsession').find(":selected").val();
    var mac=$("#MACClient").val();
    var clientname=$("#newclientname").val();
    var clientdesc=$("#newclientdesc").val();
    //var autologin=$("#newcheck").is(':checked');
    var username=$('#newclientlogin').val();
    var i=lastid+1; // Index of last id added to list
    var autologin='';
    if ($("#newcheck").is(':checked')) autologin='checked';
    
  /*  alert("session name: "+sessionname);
    alert("session id: "+ sessionid);
    alert("mac: "+mac);
    alert("clientname: "+clientname);
    alert("client desc: "+ clientdesc);
    alert("autologin: "+ autologin);
    alert("username: "+ username);*/
    
    
    if ($("#MACClient").val()=='') alert(gettext("MAC can not be empty"));
    else if (ExistsMac(mac)) alert(gettext("MAC already exists"));
    else if (!ValidaMAC($("#MACClient").val())) alert (gettext("MAC format not valid"));
    else {
        //alert($("#MACClient").val());
        // Adding a new Client
        
        if (sessionid=="gnome"){
        ItemSession="<select class='ClientItem'> \
                        <option value='gnome' selected>"+gettext("Gnome Classic")+"</option> \
                        <option value='lxde'>"+gettext("LXDE, escriptori lleuger")+"</option> \
                    </select>";
        } else {
        ItemSession="<select class='ClientItem'> \
                        <option value='gnome'>"+gettext("Gnome Classic")+"</option> \
                        <option value='lxde' selected>"+gettext("LXDE, escriptori lleuger")+"</option> \
                    </select>";
        }
        
        
        if(autologin=="true"){
            ItemLogin="<div class='ClientItem'>"+gettext("Username: ")+"</div><input class='ClientItem' type='text' id='user"+i+"' value='"+username+"'></input>"
        } else
            ItemLogin="<div class='ClientItem' disabled>"+gettext("Username: ")+"</div><input class='ClientItem' type='text' id='user"+i+"' value='"+username+"' disabled></input>"
                
        ItemList="<div class='ClientConfig' id='Client"+i+"'> \
                    <div class='ClientRow' id='ClientRow"+i+"'>\
                        <div class='ClientRowArrow' id='ClientRowArrow"+i+"' onclick='ShowDetails("+i+")'> \
                            <img src='styles/images/arrowwhite.png'/></div> \
                            Client: "+mac+" \
                            <div class='ButtonDeleteRight' onclick='handleDeleteClient("+i+")'> Delete\
                            </div></div>\
                    <div class='ClientDetails' id='ClientDetails"+i+"'> \
                      <div class='ClientLine'> \
                        <div class='ClientItem'>"+gettext("Name: ")+"</div><input class='ClientItem' type='text' value='"+clientname+"'></input>\
                        <div class='ClientItem'>"+gettext("Description: ")+"</div><input class='ClientItem' type='text' value='"+clientdesc+"'></input>\
                        </div><div class='ClientLine'> \
                        <div class='ClientItem'>Session: </div> "+ItemSession+" \
                        <div class='ClientItem'><input id='check"+i+"' onchange='handleChange(this);' class='ClientItemCheckBox' type='checkbox' name='autologin' value='autologin' "+autologin+">"+gettext("Autologin")+"</input></div>"+ItemLogin+" \
                      </div> \
                    </div> \
                 </div>";
    
        
    $("#ClientContent").append(ItemList);
        
    newClient={"mac": mac, "name": clientname, "desc": clientdesc,  "session": sessionname,
         "monitor":"auto", "autologin":autologin, "username":username};

    clientData.clients[i]=newClient;
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
    // Display Clients
    DisplayClients();

    // Bind events with actions
    //BindEventHandlers();
});

// Event Dispatchers
// Functions called from python


// Event Handlers
// Handle events on page to python


