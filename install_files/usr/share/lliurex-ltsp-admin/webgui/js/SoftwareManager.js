
var lastid=0; // To save the last image id
//var clientData=new Object();
var metaPkgData = new Object();



function DisplayMeta(){
    // Display all clients, with possibility to expand its properties
    
    for (var i=0;i<metaPkgData.meta.length;i++){
        
        // Our clients will be identified by their MAC withou # (strid)
        strid=(metaPkgData.meta[i].name).toString();
        pkglist=""
        

        for(var j=0;j<metaPkgData.meta[i].packages.length;j++){
            pkglist=pkglist+"<div class='MetaLine' id='"+metaPkgData.meta[i].packages[j].name+"'><div class='PgkItem'>"+metaPkgData.meta[i].packages[j].name+
            "</div><div class='PgkItem'>"+gettext("Version: ")+metaPkgData.meta[i].packages[j].version+"</div>";
            if (metaPkgData.meta[i].packages[j].installed=="yes")
                pkglist=pkglist+"<span class='pkgInstalled'>"+gettext("Installed")+"</span></div>";
            else
                pkglist=pkglist+"<input name='check_"+metaPkgData.meta[i].packages[j].name+"' onchange='handleChange(this);' class='InstallCheckBox' type='checkbox' name='autologin' value='autologin'>"+gettext("Install")+"</input></div>";
            
        }
        
        ItemList="<div class='MetaConfig' id='Client"+strid+"'> \
                    <div class='MetaRow' id='MetaRow"+strid+"'>\
                        <div class='MetaRowArrow' id='MetaRowArrow"+strid+"' onclick='ShowDetails(\""+strid+"\")'> \
                            <img src='styles/images/arrowwhite.png'/></div> \
                            "+gettext("Software from metapackage: ")+metaPkgData.meta[i].name+"("+metaPkgData.meta[i].lliurex_version+") \
                            </div>\
                    <div class='MetaDetails' id='MetaDetails"+strid+"'> \
                      <div class='MetaLine'> \
                        "+pkglist+"\
                      </div> \
                    </div> \
                 </div>";
    
    /*$("#check"+i).bind('change', function(){
        alert("check"+1);
    })*/
    
        
    
    $("#MetaContent").append(ItemList);
    lastid=i;
    }
    
    //newItem="<div class='NewMetaRow' id='AddRow"+lastid+"' onclick='addNewMeta(AddRow"+lastid+"')>Add a new client</div>"
    //LastMetaId="addNewMeta('AddRow"+lastid+"')";
    //LastMetaId="AddRow"+lastid;
    //alert (LastMetaId);
    //newItem="<div class='NewMetaRow' id='AddRow"+lastid+"'   onclick='addNewMeta (LastMetaId)'>Add a new client</div>"
    //newItem="<div class='NewMetaRow' id='AddRow"+lastid+"'   onclick='addNewMeta(LastMetaId)'>Add a new client</div>"
    
    //ButtonNew="<div class='Button' onclick='addNewMeta()'>"+$.i18n("New Meta")+"</div>"
    /*ButtonNew="<div class='Button NewMeta' onclick='addNewMeta()'>"+gettext("New Meta")+"</div>"
    ButtonSave="<div class='Button SaveChanges' onclick='SaveChanges()'>"+gettext("Apply Changes")+"</div>"
    divButtons="<div class='ButtonList'>"+ButtonNew+ButtonSave+"</div>";*/
    ButtonNext="<div class='Button Next' onclick='InstallSoftware()'>"+gettext("Next")+"</div>"
    divButtons="<div class='ButtonList'>"+ButtonNext+"</div>";
        
    $("#AppContainer").append(divButtons);
}


function SaveChanges(){
    // send data to python core to save it and refresh the view
    //alert($.toJSON(metaPkgData));
    location.href='ltsp://MetaSaveConfig/'+escape($.toJSON(metaPkgData));

    
    
    
}


function getMacFromClipboard() {
    location.href='ltsp://GetMacFromN4d';
}
function setMac(mac){
    $("#MACClient").val(mac);
}


function handleChange(cb) {
   // alert(cb.name);
    //var x=document.getElementsByName(cb.name);
    //alert(x.length);
    if (cb.checked){
        $("input[name^="+cb.name+"]").attr("checked", true);
        //$('[name="' + cb.name + '"]').checked=true;
        //$("#"+cb.id).checked=true;
        }
    if (!cb.checked){
        $("input[name^="+cb.name+"]").attr("checked", false);
        //$('[name="' + cb.name + '"]').checked=true;
        //$("#"+cb.id).checked=true;
        }
    
    
    
    /*alert(cb.id.indexOf("check"));
    if(cb.id.indexOf("check")==0){ // handling change on List of Clients
        //id="#user"+cb.id.split("check")[1];
        id=cb.id;
        //alert(id);
        if (cb.checked==false) $(id).attr("disabled", true);
        else $(id).removeAttr("disabled");
    } else { // handling change on "New Client" Window
        //alert("CB Checked: "+ cb.checked);
        if (cb.checked==false) $("#newclientlogin").attr("disabled", true);
        else $("#newclientlogin").removeAttr("disabled");
    }*/
}


function handleDeleteClient(strid){
     
     // Find Client on metaPkgData
     id=-1;
     for(i=0;i<metaPkgData.meta.length;i++){
        currentstrid=(metaPkgData.clients[i].mac).toString().replace(/:/g,"");
        console.log("Compare: "+currentstrid+" \n with "+strid+" \n at position "+i);
        if (currentstrid==strid) {
            //alert("Found at position "+i);
            id=i;
            break;
        }
     }
     if (id==-1) return false;
     
     console.log(metaPkgData.clients.length+"-"+id);
          
     title=gettext("Delete Client");
     text=gettext("Do you want to delete the client ")+metaPkgData.clients[id].name+gettext(" with MAC ")+metaPkgData.clients[id].mac;
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
                
                metaPkgData.meta.splice(this.id,1);
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


function AddClient(){
    var sessionname = $('#newclientsession').find(":selected").text();
    var sessionid = $('#newclientsession').find(":selected").val();
    var mac=$("#MACClient").val();
    var clientname=$("#newclientname").val();
    var clientdesc=$("#newclientdesc").val();
    //var autologin=$("#newcheck").is(':checked');
    var username=$('#newclientlogin').val();
    //var i=lastid+1; // Index of last id added to list
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
        strid=mac.replace(/:/g,"");
        
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
            ItemLogin="<div class='ClientItem'>"+gettext("Username: ")+"</div><input class='ClientItem' type='text' id='user"+strid+"' value='"+username+"'></input>"
        } else
            ItemLogin="<div class='ClientItem' disabled>"+gettext("Username: ")+"</div><input class='ClientItem' type='text' id='user"+strid+"' value='"+username+"' disabled></input>"
                
        ItemList="<div class='MetaConfig' id='Client"+strid+"'> \
                    <div class='NewClientRow' id='ClientRow"+strid+"'>\
                        <div class='ClientRowArrow' id='MetaRowArrow"+strid+"' onclick='ShowDetails(\""+strid+"\")'> \
                            <img src='styles/images/arrowwhite.png'/></div> \
                            Client: "+mac+" \
                            <div class='ButtonDeleteRight' onclick='handleDeleteClient(\""+strid+"\")'> Delete\
                            </div></div>\
                    <div class='ClientDetails' id='ClientDetails"+strid+"'> \
                      <div class='ClientLine'> \
                        <div class='ClientItem'>"+gettext("Name: ")+"</div><input class='ClientItem' type='text' value='"+clientname+"'></input>\
                        <div class='ClientItem'>"+gettext("Description: ")+"</div><input class='ClientItem' type='text' value='"+clientdesc+"'></input>\
                        </div><div class='ClientLine'> \
                        <div class='ClientItem'>Session: </div> "+ItemSession+" \
                        <div class='ClientItem'><input id='check"+strid+"' onchange='handleChange(this);' class='ClientItemCheckBox' type='checkbox' name='autologin' value='autologin' "+autologin+">"+gettext("Autologin")+"</input></div>"+ItemLogin+" \
                      </div> \
                    </div> \
                 </div>";
    
        
    $("#MetaContent").append(ItemList);
        
    newClient={"mac": mac, "name": clientname, "desc": clientdesc,  "session": sessionname,
         "monitor":"auto", "autologin":autologin, "username":username};
    
    metaPkgData.meta.push(newClient);
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
    for (i=0; i<metaPkgData.clients.length ;i++)
        if (metaPkgData.clients[i].mac==mac) return true;
    // elsewhere return false
    return false;
}

$(document).ready(function() {        
    
    function getUrlVar(uv) {
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
    }
    
    var clients=getUrlVar('clientlist'); // name
    //alert (decodeURIComponent(clients));
    metaPkgData=$.parseJSON(decodeURIComponent(clients));
        
    

    DisplayMeta();

    // Bind events with actions
    //BindEventHandlers();
});

// Event Dispatchers
// Functions called from python


// Event Handlers
// Handle events on page to python


