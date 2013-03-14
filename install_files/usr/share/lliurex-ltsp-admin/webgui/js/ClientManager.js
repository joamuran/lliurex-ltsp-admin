


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
                        <option value='gnome' selected>Gnome Classic</option> \
                        <option value='lxde'>LXDE, escriptori lleuger</option> \
                    </select>";
        } else {
        ItemSession="<select class='ClientItem'> \
                        <option value='gnome' selected>Gnome Classic</option> \
                        <option value='lxde'>LXDE, escriptori lleuger</option> \
                    </select>";
        }
        
        
        if(clientData.clients[i].autologin=="checked"){
            ItemLogin="<div class='ClientItem'>Username: </div><input class='ClientItem' type='text' id='user"+i+"' value='"+clientData.clients[i].username+"'></input>"
        } else
            ItemLogin="<div class='ClientItem' disabled>Username: </div><input class='ClientItem' type='text' id='user"+i+"' value='"+clientData.clients[i].username+"' disabled></input>"
        
        
        
        ItemList="<div class='ClientConfig' id='Client"+i+"'> \
                    <div class='ClientRow' id='ClientRow"+i+"' onclick='ShowDetails("+i+")'>\
                        <div class='ClientRowArrow' id='ClientRowArrow"+i+"'> \
                            <img src='styles/images/arrowwhite.png'/></div> \
                            Client: "+clientData.clients[i].mac+" \
                            <div class='ButtonDeleteRight' onclick='handleDeleteClient("+i+")'> Delete\
                            </div></div> \
                    <div class='ClientDetails' id='ClientDetails"+i+"'> \
                      <div class='ClientLine'> \
                        <div class='ClientItem'>Name:</div><input class='ClientItem' type='text' value='"+clientData.clients[i].name+"'></input>\
                        <div class='ClientItem'>Description: </div><input class='ClientItem' type='text' value='"+clientData.clients[i].desc+"'></input>\
                        </div><div class='ClientLine'> \
                        <div class='ClientItem'>Session: </div> "+ItemSession+" \
                        <div class='ClientItem'><input id='check"+i+"' onchange='handleChange(this);' class='ClientItemCheckBox' type='checkbox' name='autologin' value='autologin' "+clientData.clients[i].autologin+">Autologin</input></div>"+ItemLogin+" \
                      </div> \
                    </div> \
                 </div>";
    
    /*$("#check"+i).bind('change', function(){
        alert("check"+1);
    })*/
    
    $("#ClientContent").append(ItemList);
    }
    
    newItem="<div class='NewClientRow'>Add a new client</div>"
    $("#ClientContent").append(newItem);
    
    
}

function handleChange(cb) {
    id="#user"+cb.id.split("check")[1];
    if (cb.checked==false) $(id).attr("disabled", true);
    else $(id).removeAttr("disabled");
}

function handleDeleteClient(id){
     title="Delete Client";
     text="Do you want to delete the client "+clientData.clients[id].name+" with MAC "+clientData.clients[id].mac;
     image="images/confirm.png";
     client="ClientConfig"+id;
     
     buttons={"cancel":{"text":"Cancel·la","ReturnValue":"false","image":"images/cancel.png"},"ok":{"text":"d'Acord","ReturnValue":"true","image":"images/ok.png"}};
     
     tip="";
     
     ShowDialog(title, text, image, buttons, tip, function(response){
        if (response) {
            $("#"+this.client).hide();
            //alert("DeleteImage "+client);
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

