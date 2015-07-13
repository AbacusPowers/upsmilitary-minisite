$(document).ready(function(){
    $('.article-link').click(function(){
        $('i.fa',this).removeClass('fa-square-o').addClass('fa-check-square-o');
        console.log('click');
    });
});
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

    $('.expand-button','.veteranGateway').click(function(){
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
    //$('.hide-button','.veteranGateway').click(function(){
    //    $(this).parent('.expander__wrapper').removeClass('open-expander');
    //    $(this).siblings('.hidden-part').slideUp();
    //    //$(this).siblings('.hidden-part').velocity("transition.slideUpBigOut");
    //    //$(this).hide();
    //    //$(this).siblings('.expand-button').show();
    //    $(this).removeClass('hide-button').addClass('expand-button');
    //    $('i.fa',this).removeClass('fa-minus').addClass('fa-plus');
    //});

    //$('#modal').on('click','.expand-button',function(){
    //    $height = $(this).siblings('.hidden-part').children('.expander__child').height();
    //    $(this).parent('.expander__wrapper').addClass('open-expander');
    //    $(this).siblings('.hidden-part').slideDown();
    //    $(this).hide();
    //    $(this).siblings('.hide-button').show();
    //});
    //$('#modal').on('click','.hide-button',function(){
    //    $(this).parent('.expander__wrapper').removeClass('open-expander');
    //    $(this).siblings('.hidden-part').slideUp();
    //    $(this).hide();
    //    $(this).siblings('.expand-button').show();
    //});
    //$('.expander__parent').addClass('bellows__header');
    //$('.expander__wrapper').addClass('bellows__item');
    //$('.component--expander').bellows();
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
///**
// * Created by justin on 7/1/15.
// */

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
    ga('send','event','slider','arrow_right',slideTitle);
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
$('#job-converter').submit(function(e) {
    branch = $('#branch-of-service').val();
    jobCode = $('#job-code').val();
    ga('send', 'event', 'job_converter', 'translate', branch + '_' + jobCode);
});

//JOB CONVERTER/SEARCH LINKS
$('.job-search--job-converter').submit(function(){
    positionTitle = $(this).closest('.expander__wrapper').find('.expander__parent').text();
    if (positionTitle == 'Driver Helper (October-December)') {
        positionTitle = 'Driver Helper';
    }
    if( $(this).children('.zip-code').val() ) {
        zipCode = $(this).children('.zip-code').val();
    }
    ga('send','event','job_converter','job_converter_search', 'results_' + positionTitle );
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
$(document).ready(function(){
    var linkWidth = $('.video-link').width();
    var linkNum = $('.video-link').length;
    $('#video-list').width((linkWidth * linkNum) + 15);
    var eventWidth = $('.event__wrapper').width();
    var eventNum = $('.event__wrapper').length +1;
    $('.all-events-wrapper').width(eventWidth * eventNum);
});

$('document').ready(function(){
    //ARTICLE FUNCTIONALITY
    $('.article-link').on('click', function(e){
        e.preventDefault();
        var href = $(this).attr('href');
        // Getting Content
        getModalContent(href, true, 'page');
        showModal();
        $(this).addClass('in-history');
    });
    //VIDEO FUNCTIONALITY
    $('.video-link').on('click', function(e){
        e.preventDefault();
        var href = $(this).attr('href');
        // Getting Content
        getModalContent(href, true, 'page');
        showVideoModal();
    });
    //EVENTS FUNCTIONALITY
    $('.all-events-link').on('click', function(e){
        e.preventDefault();
        var href = $(this).attr('href');
        // Getting Content
        getModalContent(href, true, 'page');
        showEventsModal(href);
    });
    //UPS VALUES FUNCTIONALITY
    $('.values-link').on('click', function(e){
        e.preventDefault();
        var href = $(this).attr('href');
        // Getting Content
        getModalContent(href, true, 'page');
        showValuesModal();
    });

    $('a.external').click(function(e){
        e.preventDefault();
        var href = $(this).attr('href');
        showLeaveSiteModal(href);
        //loadAjaxFunctions();
        $('#offsite-modal #forward-to').attr('href',href);
        $('#destination').text(href);
        console.log(href);
        if ($('#modal').is(':visible')) {
            $('#modal').hide();
            $('body').addClass('hold-modal');
        }
        var modalHeight = $('#offsite-modal').height();
        var screenHeight = $(window).height();
        console.log(modalHeight);
        var topHeight = 0.5*(screenHeight-modalHeight);
        $('#offsite-modal').css({'top': topHeight +'px'});
    });
    $(document).on('click', '#prev-article', function (e) {
        e.preventDefault();
        var href = $(this).attr('href');
        // Getting Content
        origin = History.getState().data.origin;
        if ( origin == 'page') {
            originType = 'page';
            console.log('page!')
        } else {
            originType = 'article';
        }
        getModalContent(href, true, originType);
    })
    .on('click', '#next-article', function (e) {
        e.preventDefault();
        var href = $(this).attr('href');
        // Getting Content
        origin = History.getState().data.origin;
        console.log(origin);
        if ( origin == 'page') {
            console.log('ooops!');
            originType = 'page';
        } else {
            originType = 'article';
        }
        getModalContent(href, true, originType);
    })
    .on('click','#modal a.external',function(e){
        e.preventDefault();
        var href = $(this).attr('href');
        showLeaveSiteModal();
        $('#offsite-modal #forward-to').attr('href',href);
        $('#destination').text(href);
        console.log(href);
        if ($('#modal').is(':visible')) {
            $('#modal').hide();
            $('body').addClass('hold-modal');
        }
        var modalHeight = $('#offsite-modal').height();
        var screenHeight = $(window).height();
        console.log(modalHeight);
        var topHeight = .5*(screenHeight-modalHeight);
        $('#offsite-modal').css({'top': topHeight +'px'});
    })
    .on('click', '.article-view #close-modal', function (e) {
        e.preventDefault();
        var href = $(this).attr('href');
        if ( $('#modal-wrapper').hasClass('article-page') ) {
            console.log('article page')
            window.location.href = href;
        } else if ( History.getState().data.modal === 1 ) { //should only be true if triggered from article link (not direct visits to article)
            if ( History.getState().data.origin === 'page' ) {
                if ( $('body').hasClass('video-view') ) {
                    destroyVideoModal();
                } else if ( $('body').hasClass('values-view') ) {
                    destroyValuesModal();
                } else if ( $('body').hasClass('events-view') ) {
                    destroyEventsModal();
                    console.log('destroyEventsModal');
                } else {
                    destroyModal();
                }

                //var rewrite = History.getState().data.close;
                History.pushState(null, null, href);
            } else {
                console.log('one: ' + href);
                window.location.href = href;
            }

        } else if ($('#modal-wrapper').hasClass('article')) {
            window.location.href = href;
            console.log('two');
        }
    })
    .on('click','.leave-site-view #close-offsite-modal', function(e){
        e.preventDefault();
        destroyLeaveSiteModal();
    })
    .on('click','.leave-site-view #forward-to', function(e){
        destroyLeaveSiteModal();
    })
    .on('click','.leave-site-view #forward-cancel', function(e){
        e.preventDefault();
        destroyLeaveSiteModal();
    });
});

function getModalContent(url, addEntry, originType) {
    $('#modal').load(url +' #modal-content', null, function() {
        var originUrl = document.URL;
        if(addEntry === true) {
            var newTitle = $('#single-modal-content h1').text();
            document.title = newTitle;

            // Add History Entry using pushState
            History.pushState({ modal : 1, origin : originType, close : originUrl }, newTitle, url);
            console.log(History.getState().data);

            //add url to history cookie
            var cookie = getCookie('uvgHistory');
            var newCookieUrl = window.location.origin + url;
            if ( cookie.length ) {
                historyArray = JSON.parse(cookie);
                if (searchStringInArray(newCookieUrl, historyArray) === -1) {
                    historyArray.push(newCookieUrl);
                    setCookie('uvgHistory',JSON.stringify(historyArray), 365);
                    currentUrl = newCookieUrl;
                    console.log('I set a cookie');
                }
            } else {
                historyArray = [newCookieUrl];
                setCookie('uvgHistory',JSON.stringify(historyArray));
            }
            $('.group-link').each(function(){
                var historyArray = JSON.parse(cookie);
                var linkUrl = window.location.origin + $(this).children('a.history-checkbox').attr('href');
                if (searchStringInArray(linkUrl, historyArray) === -1) {
                    console.log(linkUrl + 'is not in the history');
                    if (currentUrl == linkUrl) {
                        $(this).children('a.history-checkbox').addClass('in-history');
                        console.log(linkUrl + ' is the current page');
                    }
                } else if (currentUrl == linkUrl) {
                    $(this).children('a.history-checkbox').addClass('in-history');
                    console.log(linkUrl + ' is the current page');
                } else {
                    $(this).children('a.history-checkbox').addClass('in-history');
                }
            });
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

function getLeaveSiteModalContent(url, addEntry, originType) {

    // Updating Content on Page
    $('#offsite-modal').load(url +' #modal-content', null, function(){
        var originUrl = document.URL;
        //GET RID OF IDs ON THESE FUNCTIONS. NEED TO CHANGE IN HTML
        //$('#offsite-modal','.leave-site-view').on('click','#close-offsite-modal', function(e){
        //    e.preventDefault();
        //    destroyLeaveSiteModal();
        //});
        //$('#offsite-modal','.leave-site-view').on('click','#forward-to', function(e){
        //    destroyLeaveSiteModal();
        //});
        //$('#offsite-modal','.leave-site-view').on('click','#forward-cancel', function(e){
        //    e.preventDefault();
        //    destroyLeaveSiteModal();
        //});
        //$('a.external').click(function(e){
        //    e.preventDefault();
        //    var href = $(this).attr('href');
        //    showLeaveSiteModal();
        //    $('#offsite-modal #forward-to').attr('href',href);
        //    $('#destination').text(href);
        //    console.log(href);
        //
        //    if ($('#modal').is(':visible')) {
        //        $('#modal').hide();
        //        $('body').addClass('hold-modal');
        //    }
        //    var modalHeight = $('#offsite-modal').height();
        //    var screenHeight = $(window).height();
        //    console.log(modalHeight);
        //    var topHeight = 0.5*(screenHeight-modalHeight);
        //    $('#offsite-modal').css({'top': topHeight +'px'});
        //});
        if(addEntry === true) {
            // Add History Entry using pushState
            History.pushState({ modal : 1, origin : originType, close : originUrl }, null, url);
            console.log(History.getState().data);
        }
    });

}
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
    console.log('done');
}
function svgSize(){ //call this if jquery sizing is necessary

    setTimeout(function(){
        var modalWidth = $('#modal-content').width();

        $('svg#values_svg').width(modalWidth).height(modalWidth * 1.3021288292);
        console.log('width: ' + $('svg#values_svg').width() + ', height: ' + $('svg#values_svg').height());

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
    $('#offsite-modal','.leave-site-view').on('click','#close-offsite-modal', function(e){
        e.preventDefault();
        destroyLeaveSiteModal();
    });
    $('#offsite-modal','.leave-site-view').on('click','#forward-to', function(e){
        destroyLeaveSiteModal();
    });
    $('#offsite-modal','.leave-site-view').on('click','#forward-cancel', function(e){
        e.preventDefault();
        destroyLeaveSiteModal();
    });

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
        if ($('#article-page-marker').length > 0) { //detect if this is a dummy page
            window.location = window.location.href; //reload the ACTUAL page at the current url
            //console.log('bing');
        }
        if(History.getState().data.modal !== 1) {
            destroyModal();
            console.log('ping');
        } else {
            showModal();
            console.log('ding');
        }
    });
})(window);


$(document).keyup(function(e) {
    if (e.keyCode == 27) $('#close-modal').click();   // esc
});

$(document).ready(function(){
    $('#job-search').submit(function(e){
        e.preventDefault();
        console.log('search');
        input = $('#search-field').val();
        location.href= 'http://jobs-ups.com/search/' + encodeURIComponent(input) + '/ASCategory/-1/ASPostedDate/-1/ASCountry/-1/ASState/-1/ASCity/-1/ASLocation/-1/ASCompanyName/-1/ASCustom1/-1/ASCustom2/-1/ASCustom3/-1/ASCustom4/-1/ASCustom5/-1/ASIsRadius/false/ASCityStateZipcode/-1/ASDistance/-1/ASLatitude/-1/ASLongitude/-1/ASDistanceType/-1';
    });
});


$( document ).ready(function() {
    /**
     * CENTER IMAGES ON PAGE LOAD
     */
    WindowWidth = $(window).width();
    ItemWidth = $('.carousel-item img').width();

    NegMargin = -(ItemWidth - WindowWidth)/2;
    $('.carousel-item img').css('margin-left', NegMargin);

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
