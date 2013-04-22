

function DisplayImageWindow(){
    $("#ImageManagerContainer").css("display", "block");
    for (var i=0;i<imageData.images.length;i++){    
    
    if(imageData.images[i].installed!="false"){
        ItemList="<div class='ImageRow'> \
                <div class='ImageImage'><img src='images/"+imageData.images[i].img+"' /></div> \
                <div class='ImageDetail'> \
                    <div class='ImageName'>"+imageData.images[i].name+"</div>\
                    <div class='ImageDesc' onclick=showDescription("+i+")>"+imageData.images[i].desc.substring(0, 80)+"...</div>\
                    <div class='ButtonList'> \
                        <div class='ButtonSel Install' id='install:"+i+"'>"+gettext("Install")+"</div>\
                        <div class='Button Update' id='update:"+i+"'>"+gettext("Update")+"</div>\
                        <div class='Button Adv' id='adv:"+imageData.images[i].id+"'>"+gettext("Advanced")+"</div>\
                        <div class='Button DeleteSel' id='delete:"+i+"'>"+gettext("Delete")+"</div>\
                    </div>\
                </div>\
                <div class='ImageStatus'> \
                  <div style='width:100%;clear:both; float:left'><img src='images/check.png' /></div>\
                 <div style='width:100%;clear:both; float:left'>Actualitzat el "+imageData.images[i].installed+"</div> \
                </div> \
                 \
            </div>";
    }else{
        ItemList="<div class='ImageRow'> \
                <div class='ImageImage'><img src='images/"+imageData.images[i].img+"' /></div> \
                <div class='ImageDetail'> \
                    <div class='ImageName'>"+imageData.images[i].name+"</div>\
                    <div class='ImageDesc' onclick=showDescription("+i+")>"+imageData.images[i].desc.substring(0, 80)+"...</div>\
                    <div class='ButtonList'> \
                        <div class='Button Install' id='install:"+i+"'>"+gettext("Install")+"</div>\
                        <div class='ButtonSel Update' id='update:"+i+"'>"+gettext("Update")+"</div>\
                        <div class='ButtonSel Adv' id='adv:"+imageData.images[i].id+"'>"+gettext("Advanced")+"</div>\
                        <div class='ButtonSel DeleteSel' id='delete:"+i+"'>"+gettext("Delete")+"</div>\
                    </div>\
                </div>\
                <div class='ImageStatus'> \
                </div> \
                 \
            </div>";
    }
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
        
        switch (command) {
            case "install":
                console.log("You pressed on install ");
                break;
            case "update":
                console.log("You pressed on update ");
                break;
            case "adv":
                console.log("You pressed on Advanced ");
                location.href='ltsp://ImageAdvanced/'+imageid;
                break;
            case "delete":
                console.log("You pressed on delete ");
                break;
                
        }
        
        //location.href='ltsp://SoftwareManager/'+escape($.toJSON(clientData));        
        
     });
    /*$(".Button").bind('mouseover', function(){
        ----> PRova hover... en css...
        $("#"+this.id).css("box-shadow","0px 0px 5px #ffff00;");
     });*/
}

$(document).ready(function() {
    //$("#EmergentMessage").hide();
    
    
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
    
    var clients=getUrlVar('imageData'); // name
    // alert (decodeURIComponent(clients));
    //alert(clients)
    imageData=$.parseJSON(decodeURIComponent(clients));
    alert(imageData)
        
    
    
    
    
    
    DisplayImageWindow();
});

function showDescription(id){
    
     title=imageData.images[id].name;
     text=imageData.images[id].desc;
     image="images/"+imageData.images[id].img;
     //buttons={"ok":{"text":"d'Acord","ReturnValue":"true","image":"images/ok.png"},"ok2":{"text":"d'Acord","ReturnValue":"true","image":"images/ok.png"}};     
     buttons={"ok":{"text":"Cancel·la","ReturnValue":"false","image":"images/cancel.png"},"ok2":{"text":"d'Acord","ReturnValue":"true","image":"images/ok.png"}};
     tip="Prem sobre la finestra per eixir"
     
          
     ShowDialog(title, text, image, buttons, tip, function(response){
        //alert(response);
        });
}