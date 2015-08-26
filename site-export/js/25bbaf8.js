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

/**
 * jQuery.browser.mobile (http://detectmobilebrowser.com/)
 *
 * jQuery.browser.mobile will be true if the browser is a mobile device
 *
 **/
(function(a){(jQuery.browser=jQuery.browser||{}).mobile=/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))})(navigator.userAgent||navigator.vendor||window.opera);


/**
 * detect IE10
 * source: http://stackoverflow.com/questions/16366907/how-do-i-detect-ie10-using-javascript
 */
function getIEVersion(){
    var agent = navigator.userAgent;
    var reg = /MSIE\s?(\d+)(?:\.(\d+))?/i;
    var matches = agent.match(reg);
    if (matches != null) {
        return { major: matches[1], minor: matches[2] };
    }
    return { major: "-1", minor: "-1" };
}

var ie_version =  getIEVersion();
var is_ie10 = ie_version.major == 10;

//add IE10 class
if (is_ie10) {
    $('html').addClass('ie10');
}

// $(document).ready(function(){
//   $(".dropdown-button").click(function() {
//     $(".dropdown-menu").toggleClass("show-menu");
//     $(".dropdown-menu > li").click(function(){
//       $(".dropdown-menu").removeClass("show-menu");
//     });
//     $(".dropdown-menu.dropdown-select > li").click(function() {
//       $(".dropdown-button").html($(this).html());
//     });
//   });
// });


$('document').ready(function(){

    $(document).on('click','.veteranGateway .expand-button', function(){
        $(this).parent('.expander__wrapper').toggleClass('open-expander');
        $(this).siblings('.hidden-part').slideToggle(function(){
            $(this).parent('.expander__wrapper').trigger('classChange');
        });
        $(this).children('i.fa').toggleClass('fa-plus').toggleClass('fa-minus');
    });
    $('#modal').on('click','.expand-button',function(){
        $(this).parent('.expander__wrapper').toggleClass('open-expander').trigger('classChange');
        $(this).siblings('.hidden-part').slideToggle(function(){
            $(this).parent('.expander__wrapper').trigger('classChange');
        });
        $(this).children('i.fa').toggleClass('fa-plus').toggleClass('fa-minus');
    });
});

// Giovanni Version

$( function(){

  'use strict';

  var $showButton = $('.faq-wrapper .expand-button'),
      $hideButton = $('.faq-wrapper .hide-button');

  $showButton.click(function(){
    var id = $(this).attr('data-id');
      var height = $('.hidden-part[data-id="'+id+'"] .faq__answer').height();
        height = height+25;/*Adds extra padding to the bottom*/
        
    $(this).velocity({opacity:0})
      .css('z-index',1)
      .next('.hide-button')
      .velocity({opacity:1})
      .css('z-index',2)
      .next('.hidden-part')
      .velocity({height:height});
      $('.hidden-part[data-id="'+id+'"] *').velocity({opacity:1},{duration:400}); 
  });

  $hideButton.click(function(){
    var id = $(this).attr('data-id');
    $('.hidden-part[data-id="'+id+'"] *').velocity({opacity:0},{duration:200}); 
    $(this).velocity({opacity:0})
      .css('z-index',1)
      .prev('.expand-button')
      .velocity({opacity:1})
      .css('z-index',2)
      .next()
      .next()
      .velocity({height:0});
  });
} );
//Debounce function to use anywhere.
function debounce(fn, delay) {
    var timer = null;
    return function () {
        var context = this, args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
            fn.apply(context, args);
        }, delay);
    };
}



//SLIDERS
$('.carousel-control.next').click(function(){
    var forSlide = $(this).attr('for');
    var slideTitle = $('#' + forSlide + ' + .carousel-item .slider-text').text();
    ga('send','event','slider','arrow_right',slideTitle);
});
$('.carousel-control.prev').click(function(){
    var forSlide = $(this).attr('for');
    var slideTitle = $('#' + forSlide + ' + .carousel-item .slider-text').text();
    ga('send','event','slider','arrow_left',slideTitle);
});
$('.carousel-bullet').click(function(){
    var forSlide = $(this).attr('for');
    var forArray = forSlide.split('-');
    var circleNumber = forArray[1];
    var slideTitle = $('#' + forSlide + ' + .carousel-item .slider-text').text();
    ga('send','event','slider','circle_' + circleNumber, slideTitle);

});
$(document).on('click','.slider-text-wrapper a',function(){
    var slideTitle = $(this).children('.slider-text').text();
    ga('send','event','slider','click', slideTitle);
});

//VIDEOS
//this adds the youtube api
//actual tracking code is loaded in modal.js (if modal) and video-tracking.js (if normal pageview)
$(document).ready(function(e){
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
});


//VIDEO CAROUSEL EVENTS ??
var videoLastPos = 0;
var videoScrollDetect = function () {
    var videoCurrPos = $('#video-list').closest('.scroll-container').scrollLeft();

    if (videoLastPos < videoCurrPos) {
        //console.log('scroll right');
        ga('send','event','video','scroll_right', 'carousel');
    }
    if (videoLastPos > videoCurrPos)
    {
        //console.log('scroll left');
        ga('send','event','video','scroll_left', 'carousel');
    }
    videoLastPos = videoCurrPos;
}
$('#video-list').closest('.scroll-container').scroll( debounce(videoScrollDetect, 500) );
//var waypoints = $('.video-link').waypoint(function(direction) {
//    var videoName = $(this);
//    console.log(videoName);
//}, {
//    context: $('.scroll-container'),
//    horizontal: true
//});
viewedVideos = [];
function testViewedVideos(){
    $('.video-link').each(function(index){
        if(isScrolledIntoView($(this)) ) {
            var videoTitle = $(this).children('.video-title').text();
            //console.log(videoTitle + ' - ' + viewedVideos.indexOf(videoTitle))
            if (viewedVideos.indexOf(videoTitle) === -1) {
                viewedVideos.push(videoTitle);
                var position = index + 1;
                ga('send','event','video_carousel','shown_position_'+position,videoTitle);
            }
        }
    });
}
$(document).ready(function(){
    testViewedVideos();
});
function isScrolledIntoView(elem) {
    var docViewLeft = elem.parent('.scroll-container').scrollLeft();
    var docViewBottom = docViewLeft + $('.scroll-container').width();

    var elemLeft = $(elem).offset().left;
    var elemBottom = elemLeft + $(elem).width();

    return ((elemBottom <= docViewBottom) && (elemLeft >= docViewLeft));
}
$('.scroll-container').scroll(function(){
        testViewedVideos();
    }
);

//CTA GO
$('.cta-button--go').click(function(){
    ga('send','event','cta_click','click','go');
});


//CTA APPLY NOW
$('.cta-button--apply').click(function(){
    ga('send','event','cta_click','click','apply_now');
});


//SOCIAL ICONS
$('.social-button').click(function(){
    socialNetworkName = $(this).attr('data-network');
    ga('send','event','social_icons','click', socialNetworkName);
});

//PDF DOWNLOADS FROM MODAL
$(document).on('click','.article-download',function(){
    fileName = $(this).attr('href').split('downloads/')[1];
    ga('send','event','pdf_download','click', fileName)
});


//ACCORDION EXPAND/COLLAPSE
$(document).on('click','.expander__wrapper .expand-button',function(){
    expanderSectionName = $('.expander__parent',this).text();

    if ( $('i.fa',this).hasClass('fa-minus') ) {
        ga('send','event','content_expand','collapse', expanderSectionName);
    } else {
        ga('send','event','content_expand','expand', expanderSectionName);
    }
});


//TRANSLATE BUTTON
$('#military-skills-translator').submit(function(e) {
    branch = $('#branch-of-service').val();
    jobCode = $('#job-code').val();
    ga('send', 'event', 'military_skills_translator', 'translate', branch + '_' + jobCode);
});

//JOB CONVERTER/SEARCH LINKS
$('.job-search--military-skills-translator').submit(function(){
    positionTitle = $(this).closest('.expander__wrapper').find('.expander__parent').text();
    if (positionTitle == 'Driver Helper (October-December)') {
        positionTitle = 'Driver Helper';
    }
    if( $(this).children('.zip-code').val() ) {
        zipCode = $(this).children('.zip-code').val();
    }
    ga('send','event','military_skills_translator','military_skills_translator_search', 'results_' + positionTitle );
});
$('.job-search--job-description').submit(function(){
    positionTitle = $(this).closest('.expander__wrapper').find('.expander__parent').text();
    if (positionTitle == 'Driver Helper (October-December)') {
        positionTitle = 'Driver Helper';
    }
    if( $(this).children('.zip-code').val() ) {
        zipCode = $(this).children('.zip-code').val();
    }
    ga('send','event','hot_jobs','job_description_search', 'results_' + positionTitle );
});
$(document).on('click','.job-wrapper .search-button',function(){
    positionTitle = $(this).closest('.job-wrapper').find('p span').text();
    if (positionTitle == 'Driver Helper (Oct-Dec)') {
        positionTitle = 'Driver Helper';
    }
    ga('send','event','job_map','job_map_search', 'results_' + positionTitle );
});

//EVENTS CAROUSEL EVENTS
var eventLastPos = 0;
var eventScrollDetect = function () {
    var eventCurrPos = $('.all-events-wrapper').closest('.scroll-container').scrollLeft();

    if (eventLastPos < eventCurrPos) {
        //console.log('scroll right');
        ga('send','event','career_events','scroll_right', 'carousel');
    }
    if (eventLastPos > eventCurrPos)
    {
        //console.log('scroll left');
        ga('send','event','career_events','scroll_left', 'carousel');
    }
    eventLastPos = eventCurrPos;
}
$('.all-events-wrapper').closest('.scroll-container').scroll( debounce(eventScrollDetect, 500) );


//EVENTS GMAP LINK CLICK
$(document).on('click','.event__map-link',function() {
    var eventTitle = $(this).closest('.event__wrapper').find('.event__title').text();
    ga('send','event','career_events','google_map_click', eventTitle);
});

//JOB SEARCH
$('#search-submit').click(function(e, input) {
    input = $('#search-field').val();
    ga('send','event','job_search','search', input );
});

//EXTERNAL LINKS w/ MODAL
//see modal.js

//EXTERNAL UPS LINKS
$(document).on('click','a',function(){
    if ( !$(this).hasClass('expand-button') && !$(this).hasClass('cta-button--go') ){
        var href = $(this).attr('href').toLowerCase();
        //Put UPS urls here
        var upsUrls = [
            'ups.com',
            'upsjobs.com',
            'jobs-ups.com',
            'upsjobs', //facebook, twitter, youtube
            'ups/careers', //linkedin
            '106158684691824289340' //google + account
        ];
        var arrLength = upsUrls.length;
        for ( var i = 0; i < arrLength; i++) {
            if ( href.indexOf(upsUrls[i].toLowerCase()) != -1) {
                ga('send','event','external_link','click', href );
            }
        }
    }


});
$(document).ready(function(){
    var linkWidth = $('.video-link').width();
    var linkNum = $('.video-link').length;
    $('#video-list').width((linkWidth * linkNum) + 15);
    var eventWidth = $('.event__wrapper').width();
    var eventNum = $('.event__wrapper').length +1;
    $('.all-events-wrapper').width(eventWidth * eventNum);
});

$(document)
    .on('click','.article-link', function(e){
        e.preventDefault();
        var href = $(this).attr('href');
        // Getting Content
        getModalContent(href, true, 'page');
        showModal();
        $(this).addClass('in-history');
        $('i.fa',this).removeClass('fa-square-o').addClass('fa-check-square-o');
    })
    //VIDEO FUNCTIONALITY
    .on('click','.video-link', function(e){
        e.preventDefault();
        var href = $(this).attr('href');
        // Getting Content
        getModalContent(href, true, 'page');
        showVideoModal();
    })
    //PHOTO FUNCTIONALITY
    .on('click','.photo-link', function(e){
        e.preventDefault();
        var href = $(this).attr('href');
        // Getting Content
        getModalContent(href, true, 'page');
        showPhotoModal();
        //console.log('test');
    })
    //EVENTS FUNCTIONALITY
    .on('click','.all-events-link', function(e){
        e.preventDefault();
        var href = $(this).attr('href');
        // Getting Content
        getModalContent(href, true, 'page');
        showEventsModal(href);
    })
    //UPS VALUES FUNCTIONALITY
    .on('click', '.values-link', function(e){
        e.preventDefault();
        var href = $(this).attr('href');
        // Getting Content
        getModalContent(href, true, 'page');
        showValuesModal();
    })
    //EXTERNAL LINKS
    .on('click','a.external',function(e){
        e.preventDefault();
        var href = $(this).attr('href');
        showLeaveSiteModal(href);
        //loadAjaxFunctions();
        $('#offsite-modal #forward-to').attr('href',href);
        $('#destination').text(href);
        ga('send','event','external_link','open', href);
        if ($('#modal').is(':visible')) {
            $('#modal').hide();
            $('body').addClass('hold-modal');
        }
        var modalHeight = $('#offsite-modal').height();
        var screenHeight = $(window).height();
        //console.log(modalHeight);
        if (modalHeight < screenHeight){
            var topHeight = 0.5*(screenHeight-modalHeight);
            $('#offsite-modal').css({'top': topHeight +'px'});
        } else {
            $('#offsite-modal').css({'height':'100%'});
        }
    })
    //ARTICLE NAVIGATION
    .on('click', '#prev-article', function (e) {
        e.preventDefault();
        var href = $(this).attr('href');
        // Getting Content
        origin = History.getState().data.origin;
        if ( origin == 'page') {
            originType = 'page';
            //console.log('page!')
        } else {
            originType = 'article';
        }
        if ($('#modal-wrapper').hasClass('values')){
            $('#modal-wrapper').removeClass('values');
            $('#culture-articles').show();
        }
        getModalContent(href, true, originType);
        setTimeout(function(){
            if ($('#wrapper--values').length){
                $('#modal-wrapper').addClass('values');
                $('#culture-articles').hide();
                //console.log('yes');
            } else {
                //console.log('no');
            }
        }, 300);
    })
    .on('click', '#next-article', function (e) {
        e.preventDefault();
        var href = $(this).attr('href');
        // Getting Content
        origin = History.getState().data.origin;
        console.log(origin);
        if ( origin == 'page') {
            //console.log('ooops!');
            originType = 'page';
        } else {
            originType = 'article';
        }
        if ($('#modal-wrapper').hasClass('values')){
            $('#modal-wrapper').removeClass('values');
            $('#culture-articles').show();
        }
        getModalContent(href, true, originType);
        setTimeout(function(){
            if ($('#wrapper--values').length){
                $('#modal-wrapper').addClass('values');
                $('#culture-articles').hide();
                //console.log('yes');
            } else {
                //console.log('no');
            }
        }, 300);
    })
    .on('click','#modal a.external',function(e){
        e.preventDefault();
        var href = $(this).attr('href');
        showLeaveSiteModal();
        $('#offsite-modal #forward-to').attr('href',href);
        $('#destination').text(href);
        ga('send','event','external_link','open', href);
        if ($('#modal').is(':visible')) {
            $('#modal').hide();
            $('body').addClass('hold-modal');
        }
        var modalHeight = $('#offsite-modal').height();
        var screenHeight = $(window).height();
        //console.log(modalHeight);
        if (modalHeight < screenHeight){
            var topHeight = 0.5*(screenHeight-modalHeight);
            $('#offsite-modal').css({'top': topHeight +'px'});
        } else {
            $('#offsite-modal').css({'height':'100%'});
        }
    })
    .on('click', '.article-view #close-modal', function (e) {
        e.preventDefault();
        var href = $(this).attr('href');
        if ( $('#modal-wrapper').hasClass('article-page') ) {
            //console.log('article page')
            window.location.href = href;
        } else if ( History.getState().data.modal === 1 ) { //should only be true if triggered from article link (not direct visits to article)
            if ( History.getState().data.origin === 'page' ) {
                if ( $('body').hasClass('video-view') ) {
                    destroyVideoModal();
                } else if ( $('body').hasClass('photo-view') ) {
                    destroyPhotoModal();
                } else if ( $('body').hasClass('values-view') ) {
                    destroyValuesModal();
                } else if ( $('body').hasClass('events-view') ) {
                    destroyEventsModal();
                    //console.log('destroyEventsModal');
                } else {
                    destroyModal();
                }

                //var rewrite = History.getState().data.close;
                History.pushState(null, null, href);
            } else {
                //console.log('one: ' + href);
                window.location.href = href;
            }

        } else if ($('#modal-wrapper').hasClass('article')) {
            window.location.href = href;
            //console.log('two');
        }
    })
    .on('click','.leave-site-view #close-offsite-modal', function(e){
        e.preventDefault();
        destroyLeaveSiteModal();
        var href = $('#forward-to').attr('href');
        ga('send','event','external_link','close', href);
    })
    .on('click','.leave-site-view #forward-to', function(e){
        e.preventDefault();

        destroyLeaveSiteModal();
        var href = $(this).attr('href');
        window.open(
            href,
            '_blank' // <- This is what makes it open in a new window.
        );
        ga('send','event','external_link','continue', href);
    })
    .on('click','.leave-site-view #forward-cancel', function(e){
        e.preventDefault();
        var href = $(this).siblings('#forward-to').attr('href');
        destroyLeaveSiteModal();
        ga('send','event','external_link','cancel', href);
    });

function getModalContent(url, addEntry, originType) {
    console.log('aha');
    $('#modal').load(url +' #modal > *', null, function() {
        //debugger;
        var originUrl = document.URL;
        if(addEntry === true) {
            var newTitle = $('#single-modal-content h1').text();
            document.title = newTitle;

            // Add History Entry using pushState
            History.pushState({ modal : 1, origin : originType, close : originUrl }, newTitle, url);
            //console.log(History.getState().data);

            ////add url to history cookie
            updateCookie(siteOrigin + url);

            //ANALYTICS - SET PAGE URL AND TITLE
            ga('set', {
                page: url,
                title: newTitle
            });
            //ANALYTICS - SEND PAGEVIEW
            ga('send', 'pageview');

            //Prepare YouTube tracking after AJAX load
            onYouTubeIframeAPIReady();
        }
    });
}

//function getLeaveSiteModalContent(url, addEntry, originType) {
//
//    // Updating Content on Page
//    $('#offsite-modal').load(url +' #modal-content', null, function(){
//        var originUrl = document.URL;
//        //GET RID OF IDs ON THESE FUNCTIONS. NEED TO CHANGE IN HTML
//        //$('#offsite-modal','.leave-site-view').on('click','#close-offsite-modal', function(e){
//        //    e.preventDefault();
//        //    destroyLeaveSiteModal();
//        //});
//        //$('#offsite-modal','.leave-site-view').on('click','#forward-to', function(e){
//        //    destroyLeaveSiteModal();
//        //});
//        //$('#offsite-modal','.leave-site-view').on('click','#forward-cancel', function(e){
//        //    e.preventDefault();
//        //    destroyLeaveSiteModal();
//        //});
//        //$('a.external').click(function(e){
//        //    e.preventDefault();
//        //    var href = $(this).attr('href');
//        //    showLeaveSiteModal();
//        //    $('#offsite-modal #forward-to').attr('href',href);
//        //    $('#destination').text(href);
//        //    console.log(href);
//        //
//        //    if ($('#modal').is(':visible')) {
//        //        $('#modal').hide();
//        //        $('body').addClass('hold-modal');
//        //    }
//        //    var modalHeight = $('#offsite-modal').height();
//        //    var screenHeight = $(window).height();
//        //    console.log(modalHeight);
//        //    var topHeight = 0.5*(screenHeight-modalHeight);
//        //    $('#offsite-modal').css({'top': topHeight +'px'});
//        //});
//        if(addEntry === true) {
//            // Add History Entry using pushState
//            History.pushState({ modal : 1, origin : originType, close : originUrl }, null, url);
//            //console.log(History.getState().data);
//        }
//    });
//
//}
var targetURL = '';

function showModal(){
    $('#overlay').show();
    $('#modal').fadeIn();
    $('body').addClass('article-view');
    $('#modal-wrapper').addClass('article');
}

function showVideoModal(){
    $('#overlay').show();
    $('#modal').fadeIn();
    $('body').addClass('video-view');
    $('#modal-wrapper').addClass('video');

    setTimeout(function(){ //VIDEO OPEN TRACKING
        videoTitle = $('#video-title').text();
        //video open tracking
        ga('send','event','video','open',videoTitle);
    }, 201);

}

function showPhotoModal(){
    $('#overlay').show();
    $('#modal').fadeIn();
    $('body').addClass('photo-view');
    $('#modal-wrapper').addClass('photo');

    //setTimeout(function(){ //VIDEO OPEN TRACKING
    //    videoTitle = $('#video-title').text();
    //    //video open tracking
    //    ga('send','event','video','open',videoTitle);
    //}, 201);

}

function showEventsModal(url){
    //var id = url.substring(url.lastIndexOf('#'));
    //console.log(id);
    $('#overlay').show();
    $('#modal').fadeIn();
    $('body').addClass('events-view');
    $('#modal-wrapper').addClass('events');
}

function showValuesModal(f){
    $('#overlay').show();
    $('#modal').show();
    $('body').addClass('values-view');
    $('#modal-wrapper').addClass('values');
    setTimeout(function(){
        //hide "related article" navigation
        $('#culture-articles').hide();

        //set all rows to the same height
        var maxHeight = -1;
        //
        $('.values-row').each(function() {
            maxHeight = maxHeight > $(this).height() ? maxHeight : $(this).height();
            //console.log(this.id + 'current max height: ' + maxHeight);
        });

        $('.values-row').each(function() {
            $(this).height(maxHeight);
        });
    }, 500);

    //console.log('done');
}

$(document).ready(function(){
    console.log($('#modal-wrapper').hasClass('values'));

    setTimeout(function(){
        if ($('#modal-wrapper').hasClass('values')) {
            //hide "related article" navigation
            $('#culture-articles').hide();

            //set all rows to the same height
            var maxHeight = -1;

            $('.values-row').each(function() {
                maxHeight = maxHeight > $(this).height() ? maxHeight : $(this).height();
                //console.log(this.id + 'current max height: ' + maxHeight);
            });

            $('.values-row').each(function() {
                $(this).height(maxHeight);
            });
        }
    }, 500);

});

function svgSize(){ //call this if jquery sizing is necessary

    setTimeout(function(){
        var modalWidth = $('#modal-content').width();

        $('svg#values_svg').width(modalWidth).height(modalWidth * 1.3021288292);
        //console.log('width: ' + $('svg#values_svg').width() + ', height: ' + $('svg#values_svg').height());

    }, 201);

    $(window).resize(function(){
        modalWidth = $('#modal-content').width();
        $('svg#values_svg').width(modalWidth).height(modalWidth * 1.3021288292);
    });
}

function showLeaveSiteModal(href){
    $('#overlay').show();
    $('#offsite-modal').fadeIn();

    $('body').addClass('leave-site-view');
    $('#modal-wrapper').addClass('leave-site');


}

function destroyModal(){
    $('#overlay').hide();
    $('#modal').hide();
    $('#offsite-modal').hide();
    $('body').removeClass('article-view');
    $('#modal-wrapper').removeClass('article');
    $('body').removeClass('hold-modal');
}

function destroyVideoModal(){
    $('#overlay').hide();
    $('#modal').hide();
    $('body').removeClass('video-view');
    $('#modal-wrapper').removeClass('video');
    $('body').removeClass('hold-modal');
    $('#single-modal-content').text('');
    ga('send','event','video','close',videoTitle); //VIDEO CLOSE TRACKING
}
function destroyPhotoModal(){
    $('#overlay').hide();
    $('#modal').hide();
    $('body').removeClass('photo-view');
    $('#modal-wrapper').removeClass('photo');
    $('body').removeClass('hold-modal');
    $('#single-modal-content').text('');
    //ga('send','event','video','close',videoTitle); //VIDEO CLOSE TRACKING
}
function destroyValuesModal(){
    $('#overlay').hide();
    $('#modal').hide();
    $('body').removeClass('values-view');
    $('#modal-wrapper').removeClass('values');
    $('body').removeClass('hold-modal');
    $('#single-modal-content').text('');
    //console.log('aaaaaa');
}
function destroyEventsModal(){
    $('#overlay').hide();
    $('#modal').hide();
    $('body').removeClass('events-view');
    $('#modal-wrapper').removeClass('events');
    $('body').removeClass('hold-modal');
}
function destroyLeaveSiteModal(){
    if($('body').hasClass('hold-modal')) {
        $('#modal').show();
    } else {
        $('#overlay').hide();
        $('body').removeClass('leave-site-view');
    }

    $('#offsite-modal').hide();

    $('#modal-wrapper').removeClass('leave-site');

}
(function(window, undefined) {
    History.Adapter.bind(window,'statechange',function(){ // Note: We are using statechange instead of popstate
        //if ($('#article-page-marker').length > 0) { //detect if this is a dummy page
        var state = History.getState();
        var url = state.url;
        console.log(url);
        //if ($('#modal-wrapper').hasClass('article-page')) { //detect if this is a dummy page
        //    window.location = window.location.href; //reload the ACTUAL page at the current url
        //    //console.log('bing');
        //}
        if(History.getState().data.modal !== 1) {
            $('#close-modal').click();
            //console.log('ping');
        } else {
            getModalContent(url, false, 'page');
            showModal();
            console.log('ding');
        }
    });
})(window);


$(document).keyup(function(e) {
    if (e.keyCode == 27) $('#close-modal').click();   // esc
});

$(document).mouseup(function (e)
{
    var container = $("#modal",'.article-view');

    if (!container.is(e.target) // if the target of the click isn't the container...
        && container.has(e.target).length === 0) // ... nor a descendant of the container
    {
        $('#close-modal').click();
    }
});

$(document).ready(function(){
    if ($('#wrapper--values').length){
        $('#modal-wrapper').addClass('values');
        $('#culture-articles').hide();
    }
});
$(document).ready(function(){
    $('#job-search').submit(function(e){
        e.preventDefault();
        //console.log('search');
        var input = $('#search-field').val();

        var forwardURL = 'https://www.jobs-ups.com/search-jobs/' + encodeURIComponent(input) + '/1187/1';

        window.open(
            forwardURL,
            '_blank' // <- This is what makes it open in a new window.
        );
    });
});


$( document ).ready(function() {
    /**
     * CENTER IMAGES ON PAGE LOAD
     */
    WindowWidth = $(window).width();
    ItemWidth = $('.carousel-item img:not(.app-badge)').width();

    NegMargin = -(ItemWidth - WindowWidth)/2;
    $('.carousel-item img:not(.app-badge)').css('margin-left', NegMargin);

    /**
     * AUTO ROTATE
     */
    var elements = $('.carousel-inner input[type="radio"]');
    var index = 0;
    var doNext = null;
    function sliderGo() {
        //if(item)index = item;
        breaker = false;
        var element = elements.eq(index);
        //var x = setTimeout(doNext, 6000);
        // do work

        $('.carousel-inner input[type="radio"]').change(function(){
            newIndex = $(this).index('.carousel-inner input[type="radio"]');
            index = newIndex;
        });

        element.prop('checked',true);
        //while (breaker == false) {
        if (index < elements.length) {
            index++;
            //x;
        } else {
            index = 0;
            //x;
        }
        //}
    }
    var slider = setInterval(sliderGo, 6000);
    //doNext();

    $('.carousel').on('click','.pause-slider',function() {
        clearInterval(slider);
        $(this).removeClass('pause-slider fa-pause').addClass('start-slider fa-play');
    });
    $('.carousel').on('click','.start-slider',function() {
        slider = setInterval(sliderGo, 6000);
        $(this).removeClass('start-slider fa-play').addClass('pause-slider fa-pause');
    });

});

/**
 * CENTER IMAGES ON WINDOW RESIZE
 */
//$( window ).resize(function() {
//   WindowWidth = $(window).width();
//   ItemWidth = $('.carousel-item img').width();
//
//   NegMargin = -(ItemWidth - WindowWidth)/2;
//   $('.carousel-item img').css('margin-left', NegMargin);
//});



$(document).ready(function(){
  $('.sliding-panel-button,.sliding-panel-fade-screen,.sliding-panel-close').on('click touchstart',function (e) {
    $('.sliding-panel-content,.sliding-panel-fade-screen').toggleClass('is-visible');
    e.preventDefault();
  });
});

$('document').ready(function(e){
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
});
    //----------YOUTUBE IFRAME EVENT TRACKING------------------//

var playerArray = new Array();
var counter = 0;
var readyCount = 0;
var videoCount;
var refreshIntervalId;

function onYouTubeIframeAPIReady() {
  videoCount = $('iframe').length;
  $('iframe').each(function(){
    var video = $(this).attr('src');
    var reg = /(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=))([\w-]{10,12})/g;
    var vidId = reg.exec(video)[1];
    var new_src = ((/\?/g.exec(video)) ? video + '&enablejsapi=1' : video + '?&enablejsapi=1');
    $(this).attr('src', new_src);
    $(this).attr('id', vidId);
    var originSrc = window.location.hostname;
    playerArray[counter] = new YT.Player(vidId, {
      videoId: vidId,
      playerVars: {
        'autohide': 1,
        'enablejsapi': 1,
        'origin': originSrc
      },
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
    counter++;
  });
}

function onPlayerReady(event) {
  readyCount++;
  if (readyCount == videoCount){
    for(var i = 0; i<playerArray.length; i++){
      playerArray[i].video_title = playerArray[i].B.videoData.title;
      playerArray[i].video_paused = true;
    }
  }
}

function trackDuration(event, title){
    var duration = parseInt(event.target.getDuration()),
        oneQuarter = Math.floor(duration/4),
        half = Math.floor(duration/2),
        threeQuarter = Math.floor(oneQuarter*3);

        refreshIntervalId = setInterval(function(){
            var currentTime = parseInt(event.target.getCurrentTime());
            switch (currentTime) {
                case oneQuarter:
                    ga('send', 'event', 'video', '25_percent', title);
                    break;
                case half:
                    ga('send', 'event', 'video', '50_percent', title);
                    break;
                case threeQuarter:
                    ga('send', 'event', 'video', '75_percent', title);
                    break;
            }
    }, 1000);
}

function onPlayerStateChange(event) {
    var thisVideoTitle = event.target.video_title;

    switch (event.data) {
        case YT.PlayerState.PLAYING:
            ga('send', 'event', 'video', 'play', thisVideoTitle);
            event.target.video_paused = false;
            trackDuration(event, thisVideoTitle);
            break;
        case YT.PlayerState.ENDED:
            ga('send', 'event', 'video', 'complete', thisVideoTitle);
            window.clearInterval(refreshIntervalId);
            break;
        case YT.PlayerState.PAUSED:
            if (event.target.video_paused != true) {
                ga('send', 'event', 'video', 'pause', thisVideoTitle);
                event.target.video_paused = true;
                window.clearInterval(refreshIntervalId);
            }
            break;
    }
}
