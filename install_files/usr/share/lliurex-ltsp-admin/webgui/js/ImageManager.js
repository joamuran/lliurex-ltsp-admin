

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
                        <div class='ButtonSel Install' id='install"+i+"'>Instal·la</div>\
                        <div class='Button Update' id='update"+i+"'>Actualitza</div>\
                        <div class='Button Add' id='add"+i+"'>Afig Programari</div>\
                        <div class='Button Delete' id='delete"+i+"'>Suprimeix</div>\
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
                        <div class='Button Install' id='install"+i+"'>Instal·la</div>\
                        <div class='ButtonSel Update' id='update"+i+"'>Actualitza</div>\
                        <div class='ButtonSel Add' id='add"+i+"'>Afig Programari</div>\
                        <div class='ButtonSel DeleteSel' id='delete"+i+"'>Suprimeix</div>\
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
        console.log("You pressed on install" +this.id);
        location.href='ltsp://SoftwareManager/';
        //location.href='ltsp://SoftwareManager/'+escape($.toJSON(clientData));        
        
     });
    /*$(".Button").bind('mouseover', function(){
        ----> PRova hover... en css...
        $("#"+this.id).css("box-shadow","0px 0px 5px #ffff00;");
     });*/
}

$(document).ready(function() {
    //$("#EmergentMessage").hide();
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