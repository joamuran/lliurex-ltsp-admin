
var lastid=0; // To save the last image id
//var clientData=new Object();
var metaPkgData = new Object();

var DesktopApps= {"Apps": [
        {"id": "synaptic",
        "icon": "styles/images/synaptic.png",
         "text": "Synaptic, Package Manager"},
        {"id": "terminal",
        "icon": "styles/images/gnome-terminal.png",
         "text": "Terminal"},
        {"id": "gedit",
        "icon": "styles/images/accessories-text-editor.png",
         "text": "Edit File"}]}


function DisplayDesktop() {
        var AppsList="";
        for (var i=0;i<DesktopApps.Apps.length;i++){
            AppsList=AppsList+"<div class='iconContainer' onclick='ExecuteApp(this);' id='"+DesktopApps.Apps[i].id+"'> \
                    <div class='iconImage'><img src='"+DesktopApps.Apps[i].icon+"'/></div> \
                    <div class='iconText'>"+gettext(DesktopApps.Apps[i].text)+"</div> </div>";
        }
            AppsList=AppsList+"<div class='iconContainer' style='float:right;' onclick='ExecuteApp(this);' id='apply'> \
                    <div class='iconImage'><img src='styles/images/lliurex-installer.png'/></div> \
                    <div class='iconText'>"+gettext('Apply to Image')+"</div> </div>";
        $("#ImageDesktop").append(AppsList);
}


function ExecuteApp(cb) {
    alert("Execute "+cb.id);
    location.href='ltsp://ExecuteInChroot/'+cb.id;
}

/*function handleChange(cb) {
    if (cb.checked){
        for (var i=0; i<document.getElementsByName(cb.name).length;i++)
            document.getElementsByName(cb.name).item(i).checked=true;
        }
    if (!cb.checked){
        for (var i=0; i<document.getElementsByName(cb.name).length;i++)
            document.getElementsByName(cb.name).item(i).checked=false;
        }
}*/

 
   /* 
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

*/
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
    
    var meta=getUrlVar('meta'); // name
    switch (meta) {
        case "client":
            $("#ImageDesktop").addClass("Desktop");
            break;
        case "desktop":
            $("#ImageDesktop").addClass("Desktop");
            break;
        case "infantil":
            $("#ImageDesktop").addClass("Infantil");
            break;
    }
    
    DisplayDesktop();

    // Bind events with actions
    //BindEventHandlers();
});

// Event Dispatchers
// Functions called from python


// Event Handlers
// Handle events on page to python

