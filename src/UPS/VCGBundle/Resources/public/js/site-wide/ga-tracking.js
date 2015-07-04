///**
// * Created by justin on 7/1/15.
// */

//SLIDERS
$('.carousel-control.next').click(function(){
    forSlide = $(this).attr('for');
    slideTitle = $('#' + forSlide + ' + .carousel-item .slider-text').text();
    ga('send','event','slider','arrow_right',slideTitle);
});
$('.carousel-control.prev').click(function(){
    forSlide = $(this).attr('for');
    slideTitle = $('#' + forSlide + ' + .carousel-item .slider-text').text();
    ga('send','event','slider','arrow_right',slideTitle);
});
$('.carousel-bullet').click(function(){
    forSlide = $(this).attr('for');
    forArray = forSlide.split('-');
    circleNumber = forArray[1];
    slideTitle = $('#' + forSlide + ' + .carousel-item .slider-text').text();
    ga('send','event','slider','circle_' + circleNumber, slideTitle);

});
//VIDEOS
//ga('send','event','video','open', videoTitle)
//ga('send','event','video','close', videoTitle)
//ga('send','event','video','play', videoTitle)
//ga('send','event','video','pause', videoTitle)
//ga('send','event','video','25_percent', videoTitle)
//ga('send','event','video','50_percent', videoTitle)
//ga('send','event','video','75_percent', videoTitle)
//ga('send','event','video','100_percent', videoTitle)
//

//VIDEO CAROUSEL EVENTS ??
//// probably need to use .debounce() http://jsfiddle.net/cowboy/cTZJU/light/
//ga('send','event','video','scroll_left', 'carousel')
//ga('send','event','video','scroll_right', 'carousel')
//
//

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
$('.article-download').click(function(){
    fileName = $(this).attr('href').split('downloads/')[1];
    ga('send','event','pdf_download','click', fileName)
});


//ACCORDION EXPAND/COLLAPSE
$('.expander__wrapper .expand-button').click(function(){
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
$('body').on('click','.job-wrapper .search-button',function(){
    positionTitle = $(this).closest('.job-wrapper').find('p span').text();
    if (positionTitle == 'Driver Helper (Oct-Dec)') {
        positionTitle = 'Driver Helper';
    }
    ga('send','event','job_map','job_map_search', 'results_' + positionTitle );
});

////CAREER CAROUSEL EVENTS
//ga('send','event','career_events','scroll_left', 'carousel')
//ga('send','event','career_events','scroll_right', 'carousel')
//ga('send','event','career_events','google_map_click', eventTitle ) //why is this "google_map_click"?? we don't have google maps
//
//
////JOB SEARCH
//g
//
$('#search-submit').click(function(e, input) {
    input = $('#search-field').val();
    ga('send','event','job_search','search', input );
});