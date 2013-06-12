


$(function(){
    // Dialog
    $('#dialog').dialog({
	autoOpen: false,
	width: 500,
	buttons: {
		/*"Ok": function() {
			$(this).dialog("close");
		},*/
		"Cancel": function() {
			$(this).dialog("close");
		}
	},
        /*modal: true,*/
        closeOnEscape: false
});

    // Dialog Link
    $('#dialog_link').click(function(){
            $('#dialog').dialog('open');
    	return false;
    });
    
    //hover states on the static widgets
        $('#dialog_link, ul#icons li').hover(
    	function() { $(this).addClass('ui-state-hover'); },
            function() { $(this).removeClass('ui-state-hover'); }
        );
    });
    
function MyAlert(text, title) {
    $('#dialog').empty();
    $('#dialog').append("<p>"+text+"</p>");
    $('#dialog').dialog('open');
    $("#dialog" ).dialog( "option", "title", title );
    /*$( "#dialog" ).dialog( "option", "modal", true );*/
    return false;
}

// END JQUERY DIALOG



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
   //$("#MessageArea").show();
   $("#MessageArea").fadeIn(300);
    
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
        //$("#MessageArea").hide();
        $("#MessageArea").fadeOut(300, function(){
        callback(ReturnValue);
        })
    }

