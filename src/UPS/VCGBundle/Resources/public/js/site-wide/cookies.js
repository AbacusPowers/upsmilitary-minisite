function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires +"; path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

function searchStringInArray (str, strArray) {
    for (var j=0; j<strArray.length; j++) {
        re = new RegExp(str);
        if (strArray[j].match(re)) return j;
    }
    return -1;
}
currentUrl = encodeURI(window.location.href);

function updateCookie(url){

    if (!window.location.origin) {
        //for IE 10
        siteOrigin = window.location.protocol + "//" + window.location.hostname;
    } else {
        siteOrigin = window.location.origin;
    }
    if(url) {
        newURL = url;
    } else{
        newURL = currentUrl;
    }
    var historyCookie = getCookie('uvgHistory');
    if ( historyCookie.length ) {
        historyArray = JSON.parse(historyCookie);
        if (searchStringInArray(newURL, historyArray) === -1) { //if the url is NOT already in the array
            historyArray.push(newURL);
            //cookie('uvgHistory','',-1);
            setCookie('uvgHistory',JSON.stringify(historyArray), 365);
        }
    } else {
        historyArray = [newURL];
        setCookie('uvgHistory',JSON.stringify(historyArray));
    }
    $('.group-link').each(function(){

        //console.log('origin is: ' + siteOrigin);
        var linkUrl = siteOrigin + $(this).children('a.history-checkbox').attr('href'); //combine link path with siteOrigin

        if (searchStringInArray(linkUrl, historyArray) === -1) {
            //nothing
        } else if (currentUrl == linkUrl) {
            $(this).children('a.history-checkbox').addClass('in-history');
        } else {
            $(this).children('a.history-checkbox').addClass('in-history');
        }
    });
    $('.history-checkbox').each(function(){

        var linkUrl = siteOrigin + $(this).attr('href');
        //console.log(linkUrl);
        if (searchStringInArray(linkUrl, historyArray) === -1) {
            //nothing
            //console.log('not visited');
        } else if (currentUrl == linkUrl) {
            $(this).addClass($(this).attr('href') + 'in-history'); //ADD THE CLASS HERE

        } else {
            $(this).addClass('in-history'); //ADD THE CLASS HERE
        }
    });
}

$(document).ready(function(){
    updateCookie();


});
