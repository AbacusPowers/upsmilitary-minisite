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

//EXTERNAL LINKS w/ MODAL
//see modal.js

//EXTERNAL UPS LINKS
$(document).on('click','a',function(){
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

});