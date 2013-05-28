

function DisplayImageWindow(){
    $("#ImageManagerContainer").css("display", "block");
    for (var i=0;i<imageData.images.length;i++){    
    
    if(i%2!=0){
        
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
                        <div class='ButtonSel Delete' id='delete"+i+"'>Suprimeix</div>\
                    </div>\
                </div>\
                <div class='ImageStatus'> \
                  <div style='width:100%;clear:both; float:left'><img src='images/check.png' /></div>\
                 <div style='width:100%;clear:both; float:left'>Actualitzat el 10/01/2012</div> \
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
        tralari();
     });
    /*$(".Button").bind('mouseover', function(){
        ----> PRova hover... en css...
        $("#"+this.id).css("box-shadow","0px 0px 5px #ffff00;");
     });*/
}


function DisplayLoginWindow(){
    $("#LoginContainer").css("display", "block");
}

$(document).ready(function() {    
    //$("#EmergentMessage").hide();
    //DisplayImageWindow();
    DisplayLoginWindow();
    
});

function showDescription(id){  
    $("#dialogContent").empty();
    $("#dialogImg").empty();
    $("#dialogHeader").empty();
    $("#dialogImg").append("<img src='images/"+imageData.images[id].img+"' />");
    $("#dialogContent").append(imageData.images[id].desc+"<p class='info'>Prem sobre la finestra per eixir</p>");
    $("#dialogHeader").append(imageData.images[id].name);
    $("#dialogWindow").show();    
    $("#EmergentMessage").show();    
}