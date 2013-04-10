
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
                            <img src='styles/images/arrowcolor.png'/></div> \
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



function handleChange(cb) {
    if (cb.checked){
        for (var i=0; i<document.getElementsByName(cb.name).length;i++)
            document.getElementsByName(cb.name).item(i).checked=true;
        }
    if (!cb.checked){
        for (var i=0; i<document.getElementsByName(cb.name).length;i++)
            document.getElementsByName(cb.name).item(i).checked=false;
        }
}

 
    
function ShowDetails(name){
    //# Show or hide details about an specific client
    
        
    if($("#MetaDetails"+name).css("display")=="block")
    {
        $("#MetaDetails"+name).slideUp(300);
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


