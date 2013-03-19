
// Setting Languages

$.urlParam = function(name){
    var results = new RegExp('[\\?&amp;]' + name + '=([^&amp;#]*)').exec(window.location.href);
    return results[1] || 0;
}


function gettext(cadena){
    //alert("Translating: "+cadena);
    ret=eval(lang)[cadena];
    if (ret==undefined) return cadena;
    else return ret;
}

//if ('undefined' == typeof lang)
if (window.location.href.indexOf('?lang')==-1)
    var lang=window.lang;
  else
     {var lang=$.urlParam('lang'); // name
     //window.lang=lang;
     }

//alert(lang);

