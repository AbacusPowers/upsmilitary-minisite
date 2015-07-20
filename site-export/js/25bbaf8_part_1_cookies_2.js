function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
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
        if (strArray[j].match(str)) return j;
    }
    return -1;
}

$(document).ready(function(){
    currentUrl = window.location.href;
    var cookie = getCookie('uvgHistory');
    if ( cookie.length ) {
        historyArray = JSON.parse(cookie);
        if (searchStringInArray(currentUrl, historyArray) === -1) {
            historyArray.push(currentUrl);
            setCookie('uvgHistory',JSON.stringify(historyArray), 365);
        }
    } else {
        historyArray = [currentUrl];
        setCookie('uvgHistory',JSON.stringify(historyArray));
    }

    //SET GROUP LINK CLASSES BASED ON COOKIE
    $('.group-link').each(function(){
        if (!window.location.origin) { //if you're using IE, window.location.origin isn't automatically available
            window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
        }
        var linkUrl = window.location.origin + $(this).children('a.history-checkbox').attr('href'); //combine link path with origin

        if (searchStringInArray(linkUrl, historyArray) === -1) {
            //nothing
        } else if (currentUrl == linkUrl) {
            $(this).children('a.history-checkbox').addClass('in-history');
        } else {
            $(this).children('a.history-checkbox').addClass('in-history');
        }
    });
    $('.history-checkbox').each(function(){
        var linkUrl = window.location.origin + $(this).attr('href');

        if (searchStringInArray(linkUrl, historyArray) === -1) {
            //nothing
        } else if (currentUrl == linkUrl) {
            $(this).addClass('in-history'); //ADD THE CLASS HERE

        } else {
            $(this).addClass('in-history'); //ADD THE CLASS HERE
        }
    });
});