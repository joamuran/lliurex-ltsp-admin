
// Setting Languages

$.urlParam = function(name){
    var results = new RegExp('[\\?&amp;]' + name + '=([^&amp;#]*)').exec(window.location.href);
    return results[1] || 0;
}


function gettext(cadena){

    if (language_list.indexOf(lang)==-1) // Not available language, use default english
    return cadena;
    
    ret=eval(lang)[cadena];
    if (ret==undefined) return cadena; // if not exists string in dictionary
    else return ret;
    
}

if (window.location.href.indexOf('?lang')==-1)
    var lang=window.lang;
  else
     {var lang=$.urlParam('lang'); // name
     //window.lang=lang;
     }
     
//alert(lang);

