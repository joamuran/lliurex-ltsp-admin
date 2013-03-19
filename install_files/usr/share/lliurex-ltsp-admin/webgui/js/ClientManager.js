
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
                        <option value='gnome' selected>"+gettext("Gnome Classic")+"</option> \
                        <option value='lxde'>"+gettext("LXDE, escriptori lleuger")+"</option> \
                    </select>";
        }
        
        
        if(clientData.clients[i].autologin=="checked"){
            ItemLogin="<div class='ClientItem'>"+gettext("Username: ")+"</div><input class='ClientItem' type='text' id='user"+i+"' value='"+clientData.clients[i].username+"'></input>"
        } else
            ItemLogin="<div class='ClientItem' disabled>"+gettext("Username: ")+"</div><input class='ClientItem' type='text' id='user"+i+"' value='"+clientData.clients[i].username+"' disabled></input>"
        
        
        
        ItemList="<div class='ClientConfig' id='Client"+i+"'> \
                    <div class='ClientRow' id='ClientRow"+i+"'>\
                        <div class='ClientRowArrow' id='ClientRowArrow"+i+"' onclick='ShowDetails("+i+")'> \
                            <img src='styles/images/arrowwhite.png'/></div> \
                            Client: "+clientData.clients[i].mac+" \
                            <div class='ButtonDeleteRight' onclick='handleDeleteClient("+i+")'> Delete\
                            </div></div>\
                    <div class='ClientDetails' id='ClientDetails"+i+"'> \
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
    ButtonNew="<div class='Button' onclick='addNewClient()'>"+gettext("New Client")+"</div>"
    ButtonSave="<div class='Button'>"+gettext("Apply Changes")+"</div>"
    divButtons="<div class='ButtonList'>"+ButtonNew+ButtonSave+"</div>";
        
    $("#AppContainer").append(divButtons);
}

function addNewClient(){
    newid=lastid+1;
    
    ItemSession="<select class='ClientItem'> \
                        <option value='gnome' selected>"+gettext("Gnome Classic")+"</option> \
                        <option value='lxde'>"+gettext("LXDE, escriptori lleuger")+"</option> \
                    </select>";
    
    ItemLogin="<div class='ClientItem' disabled>"+gettext("Username: ")+"</div><input class='ClientItem' type='text' id='user"+newid+"' value='' disabled></input>";
    
    dialog="<div id='dialogWindow'> \
          <div id='dialogHeader'>"+gettext("New Client")+"</div> \
          <div id='dialogContent'>\
         <!--div id='dialogImg'><img src='"+""+"' /></div--> \
         <div class='ClientLine'> \
            <div class='ClientItem'>"+gettext("MAC:")+"</div><input class='ClientItem' type='text'></input>\
            <div class='ClientItem'>"+""+"</div>\
            <div class='dialogButton' onclick='alert(\'Getting MAC'\)'>"+gettext("Importa MAC del portaretalls LTSP")+"</div>\
         </div><div class='ClientLine'> \
         <div class='ClientLine'> \
            <div class='ClientItem'>"+gettext("Name: ")+"</div><input class='ClientItem' type='text'></input>\
            <div class='ClientItem'>"+gettext("Description: ")+"</div><input class='ClientItem' type='text'></input>\
         </div><div class='ClientLine'> \
            <div class='ClientItem'>"+gettext("Session: ")+"</div> "+ItemSession+" \
         </div><div class='ClientLine'> \
            <div class='ClientItem'>\<input id='check"+newid+"' onchange='handleChange(this);' class='ClientItemCheckBox' type='checkbox' name='autologin' value='autologin'>"+gettext("Autologin")+"</input></div>"+ItemLogin+" \
            </div> \
            <div class='dialogButton' onclick='alert(\'Afegint \')'>"+gettext("Afig el Client")+"</div>\
            <div class='dialogButton' onclick='alert(\'Cancel \')'>"+gettext("Cancel·la")+"</div>\
          </div> </div>"
      
   $("#MessageArea").html(dialog);
   $("#MessageArea").show();
    
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
    id="#user"+cb.id.split("check")[1];
    if (cb.checked==false) $(id).attr("disabled", true);
    else $(id).removeAttr("disabled");
}

function handleDeleteClient(id){
     title=gettext("Delete Client");
     text=gettext("Do you want to delete the client ")+clientData.clients[id].name+gettext(" with MAC ")+clientData.clients[id].mac;
     image="images/confirm.png";
     client=gettext("Client")+id;
     clientRow=gettext("ClientRow")+id;
     
     buttons={"cancel":{"text":gettext("Cancel·la"),"ReturnValue":"false","image":"images/cancel.png"},"ok":{"text":gettext("d'Acord"),"ReturnValue":"true","image":"images/ok.png"}};
     
     tip="";
     
     ShowDialog(title, text, image, buttons, tip, function(response){
        if (response) {
            //$("#"+client).fadeOut(400);
            
        
            //$(function () {
                $("#"+client).slideUp(300);
            //}),
            /*$(function () {
                $("#"+client).fadeOut(400);
            })*/
           
            //$("#"+clientRow).slideUp(300);
            
            //$("#"+client).slideUp(300, alert("DeleteImage "+client));
            
            
            /*$("#"+client).animate({"opacity":"0","height":"0"},1000, function(){
                    alert("DeleteImage "+client);
                });*/
            
            
            //$("#"+client).fadeOut(300, $("#"+client).hide());
            
        }
        else alert("se queda "+client);
        });
    
        //alert(clientData.clients[id].mac);
        
        
        
        /*$("#Messages").empty();
        $("#Messages").append("<div class='ConfirmMessage' id='ConfirmMessage"+id+"' title='Confirm Delete'><p>Do you want to delete the client "+clientData.clients[id].name+" with MAC "+clientData.clients[id].mac+"</p></div> ");
        
        $( ".ConfirmMessage").dialog({ buttons: [ { text: "Ok", click: function() { $( this ).dialog( "close" ); } } ] });
        $( ".ConfirmMessage" ).dialog({ modal: true });*/
      
    }

    
function ShowDetails(i){
    if($("#ClientDetails"+i).css("display")=="block")
    {
        $("#ClientDetails"+i).slideUp(300);
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
        $("#ClientDetails"+i).slideDown(300);
        $("#ClientRowArrow"+i).animate({  borderSpacing: 90 }, {
            step: function(now,fx) {
              $(this).css('-webkit-transform','rotate('+now+'deg)');
              $(this).css('-moz-transform','rotate('+now+'deg)'); 
            $(this).css('transform','rotate('+now+'deg)');  
            },
            duration:'normal'},'linear');
    };
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


