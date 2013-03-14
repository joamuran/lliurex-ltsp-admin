
function ShowDialog(title, text, image, buttons, tip, callback){
    /*title=imageData.images[id].name;
    text=imageData.images[id].desc;
    image='images/'+imageData.images[id].img;
    buttons={"Acceptar":["true", "images/Accept.png"]};*/
     
    buttonLine="<div class='dialogListButtons'>";
    for (key in buttons){
        // http://stackoverflow.com/questions/9025579/passing-callback-function-into-onclick-event
        //buttonLine=buttonLine+"<div class='dialogButton' onclick='executeButton("+buttons[key].ReturnValue+")'>"+buttons[key].text+"</div>";
        buttonLine=buttonLine+"<div class='dialogButton' onclick='executeButton("+buttons[key].ReturnValue+","+callback+")'>"+buttons[key].text+"</div>";
        //buttonLine=buttonLine+"<div class='dialogButton' onclick='alert("+buttons[key].ReturnValue+")'>"+buttons[key].text+"</div>";
        }
    buttonLine=buttonLine+"</div>";
    
   dialog="<div id='dialogWindow'> \
          <div id='dialogHeader'>"+title+"</div> \
         <div id='dialogImg'><img src='"+image+"' /></div> \
         <div id='dialogContent'>"+text+"</div> \
         <div id='dialogListButtons'>"+buttonLine+"</div> \
          </div>"
      
   $("#MessageArea").html(dialog);
   $("#MessageArea").show();
    
    /*
    <div id="EmergentMessage" class="floatDialog" style="display: none">
    <!--div id="EmergentMessage" style="display: none"-->
      <div id="dialogWindow" onclick="$('#EmergentMessage').hide();">
         <div id="dialogHeader"></div>
         <div id="dialogImg"></div>
         <div id="dialogContent"></div>
      </div>
    </div>
  </div>
   */
    
    /*$("#dialogContent").empty();
    $("#dialogImg").empty();
    $("#dialogHeader").empty();
    $("#dialogImg").append("<img src='"+image+"' />");
    $("#dialogContent").append(text+"<p class='info'>"+tip+"</p>");
    $("#dialogHeader").append(name);
    $("#dialogWindow").show();    
    $("#EmergentMessage").show();  */



}

    function executeButton(ReturnValue, callback){
        $("#MessageArea").hide();
        callback(ReturnValue);
    }

