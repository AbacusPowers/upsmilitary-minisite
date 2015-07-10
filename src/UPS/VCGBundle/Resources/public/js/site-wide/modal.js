$('document').ready(function(){
    //ARTICLE FUNCTIONALITY
    $('.article-link').on('click', function(e){
        e.preventDefault();
        var href = $(this).attr('href');
        // Getting Content
        getModalContent(href, true, 'page');
        showModal();
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

            //ANALYTICS - SET PAGE URL AND TITLE
            ga('set', {
                page: url,
                title: newTitle
            });
            //ANALYTICS - SEND PAGEVIEW
            ga('send', 'pageview');
            onYouTubeIframeAPIReady();
            //console.log('video test');
        }


        //----------YOUTUBE IFRAME EVENT TRACKING------------------//

        //var playerArray = new Array();
        //var counter = 0;
        //var readyCount = 0;
        //var videoCount;
        //var refreshIntervalId;

        //function onYouTubeIframeAPIReady() {
        //    videoCount = $('iframe').length;
        //    console.log('videocount = ' + videoCount)
        //    $('iframe').each(function(){
        //        var video = $(this).attr('src');
        //        var reg = /(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=))([\w-]{10,12})/g;
        //        var vidId = reg.exec(video)[1];
        //        var new_src = ((/\?/g.exec(video)) ? video + '&enablejsapi=1' : video + '?&enablejsapi=1');
        //        $(this).attr('src', new_src);
        //        $(this).attr('id', vidId);
        //        var originSrc = window.location.hostname;
        //        playerArray[counter] = new YT.Player(vidId, {
        //            videoId: vidId,
        //            playerVars: {
        //                'autohide': 1,
        //                'enablejsapi': 1,
        //                'origin': originSrc
        //            },
        //            events: {
        //                'onReady': onPlayerReady,
        //                'onStateChange': onPlayerStateChange
        //            }
        //        });
        //        counter++;
        //    });
        //}

        //function onPlayerReady(event) {
        //    console.log('onPlayerReady start');
        //    readyCount++;
        //    if (readyCount == videoCount){
        //        for(var i = 0; i<playerArray.length; i++){
        //            playerArray[i].video_title = playerArray[i].B.videoData.title;
        //            playerArray[i].video_paused = true;
        //        }
        //    }
        //    console.log('onPlayerReady end');
        //}
        //
        //function trackDuration(event, title){
        //    var duration = parseInt(event.target.getDuration()),
        //        oneQuarter = Math.floor(duration/4),
        //        half = Math.floor(duration/2),
        //        threeQuarter = Math.floor(oneQuarter*3);
        //
        //    refreshIntervalId = setInterval(function(){
        //        var currentTime = parseInt(event.target.getCurrentTime());
        //        switch (currentTime) {
        //            case oneQuarter:
        //                ga('send', 'event', 'video', '25_percent', title);
        //                break;
        //            case half:
        //                ga('send', 'event', 'video', '50_percent', title);
        //                break;
        //            case threeQuarter:
        //                ga('send', 'event', 'video', '75_percent', title);
        //                break;
        //        }
        //    }, 1000);
        //}

        //function onPlayerStateChange(event) {
        //    console.log('onPlayerStateChange start');
        //    var thisVideoTitle = event.target.video_title;
        //
        //    switch (event.data) {
        //        case YT.PlayerState.PLAYING:
        //            ga('send', 'event', 'video', 'play', thisVideoTitle);
        //            event.target.video_paused = false;
        //            trackDuration(event, thisVideoTitle);
        //            break;
        //        case YT.PlayerState.ENDED:
        //            ga('send', 'event', 'video', 'complete', thisVideoTitle);
        //            window.clearInterval(refreshIntervalId);
        //            break;
        //        case YT.PlayerState.PAUSED:
        //            if (event.target.video_paused != true) {
        //                ga('send', 'event', 'video', 'pause', thisVideoTitle);
        //                event.target.video_paused = true;
        //                window.clearInterval(refreshIntervalId);
        //            }
        //            break;
        //    }
        //    console.log('onPlayerStateChange end');
        //}
        // ---- END YOUTUBE TRACKING CODE -- //
    });
}

//function getVideoModalContent(url, addEntry, originType) {
//    var originUrl = document.URL;
//    // Updating Content on Page
//    $('#modal').load(url +' #modal-content', null, function() {
//
//        if(addEntry === true) {
//            var newTitle = $('#single-modal-content h1').text();
//            document.title = newTitle;
//
//            // Add History Entry using pushState
//
//            History.pushState({ modal : 1, origin : originType, close : originUrl }, null, url);
//            console.log(History.getState().data);
//
//        }
//    });
//}
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
}
function showEventsModal(url){
    //var id = url.substring(url.lastIndexOf('#'));
    //console.log(id);
    $('#overlay').show();
    $('#modal').fadeIn(function(){
        //if(id) {
        //    $("#modal-content").delay(200).animate({scrollTop: $(id).offset().top }, 1000);
        //    $(id).closest('.event__wrapper').addClass('selected-event');
        //}
    });
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
    //var modalWidth = $('#modal-content').width();
    //
    //$('svg#values_svg').width(modalWidth).height(modalWidth * 1.3021288292);
    //console.log('width: ' + $('svg#values_svg').width() + ', height: ' + $('svg#values_svg').height());
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
        //var href = $(this).attr('href');
        destroyLeaveSiteModal();
        //var rewrite = History.getState().data.close;
        //History.pushState(null, null, rewrite);

    });
    $('#offsite-modal','.leave-site-view').on('click','#forward-to', function(e){
//        e.preventDefault();
        console.log('');
        //var href = $(this).attr('href');
        destroyLeaveSiteModal();
        //var rewrite = History.getState().data.close;
        //History.pushState(null, null, rewrite);
//                window.location.href = href;

    });
    $('#offsite-modal','.leave-site-view').on('click','#forward-cancel', function(e){
        e.preventDefault();

        //var href = $(this).attr('href');
        destroyLeaveSiteModal();
        //var rewrite = History.getState().data.close;
        //History.pushState(null, null, rewrite);
//                window.location.href = href;

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


function loadAjaxFunctions() {
    //
    //$('#modal', '.article-view').on('click', '#prev-article', function (e) {
    //    e.preventDefault();
    //    var href = $(this).attr('href');
    //    // Getting Content
    //    if (History.getState().data.origin == 'page') {
    //        originType = 'page';
    //    } else {
    //        originType = 'article';
    //    }
    //    getModalContent(href, true, originType);
    //});
    //$('#modal', '.article-view').on('click', '#next-article', function (e) {
    //    e.preventDefault();
    //    var href = $(this).attr('href');
    //    // Getting Content
    //    origin = History.getState().data.origin;
    //    console.log(origin);
    //    if ( origin == 'page') {
    //        originType = 'page';
    //    } else {
    //        originType = 'article';
    //    }
    //    getModalContent(href, true, originType);
    //});
    //$('#modal', '.video-view').on('click', '#prev-article', function (e) {
    //    e.preventDefault();
    //    var href = $(this).attr('href');
    //    // Getting Content
    //    getModalContent(href, true, 'video');
    //});
    //$('#modal', '.video-view').on('click', '#next-article', function (e) {
    //    e.preventDefault();
    //    var href = $(this).attr('href');
    //    // Getting Content
    //    getModalContent(href, true, 'video');
    //});
    //
    //
    //$('#modal', '.article-view').on('click', '#close-modal', function (e) {
    //    e.preventDefault();
    //    console.log('die');
    //    var href = $(this).attr('href');
    //    if (History.getState().data.modal === 1) { //only true if triggered from article link (not direct visits to article)
    //        if (History.getState().data.origin === 'page') {
    //            if($('body').hasClass('video-view')) {
    //                destroyVideoModal();
    //            } else if ($('body').hasClass('values-view')) {
    //                destroyValuesModal();
    //            } else {
    //                destroyModal();
    //            }
    //
    //            var rewrite = History.getState().data.close;
    //            History.pushState(null, null, rewrite);
    //        } else {
    //            window.location.href = href;
    //        }
    //
    //    } else if ($('#modal-wrapper').hasClass('article')) {
    //        window.location.href = href;
    //    }
    //});

    //$('#modal', '.video-view').on('click', '#close-modal', function (e) {
    //    e.preventDefault();
    //
    //    var href = $(this).attr('href');
    //    if (History.getState().data.modal === 1) { //only true if triggered from article link (not direct visits to article)
    //        if (History.getState().data.origin === 'page') {
    //            destroyVideoModal();
    //            var rewrite = History.getState().data.close;
    //            History.pushState(null, null, rewrite);
    //        } else {
    //            window.location.href = href;
    //        }
    //
    //    } else if ($('#modal-wrapper').hasClass('article')) {
    //        window.location.href = href;
    //    }
    //});
    //$('#modal', '.values-view').on('click', '#close-modal', function (e) {
    //    e.preventDefault();
    //
    //    var href = $(this).attr('href');
    //    if (History.getState().data.modal === 1) { //only true if triggered from article link (not direct visits to article)
    //        if (History.getState().data.origin === 'page') {
    //            destroyValuesModal();
    //            var rewrite = History.getState().data.close;
    //            History.pushState(null, null, rewrite);
    //        } else {
    //            window.location.href = href;
    //        }
    //
    //    } else if ($('#modal-wrapper').hasClass('article')) {
    //        window.location.href = href;
    //    }
    //});
}


//function getModalContent(url, addEntry, originType) {
//    $.get()
//    .done(function() {
//        var originUrl = document.URL;
//        // Updating Content on Page
//        $('#modal').load(url +' #modal-content', null, function() {
//
//                if(addEntry === true) {
//                    var newTitle = $('#single-modal-content h1').text();
//                    document.title = newTitle;
//                }
//                $('#modal', '.article-view').on('click', '#prev-article', function (e) {
//                    e.preventDefault();
//                    var href = $(this).attr('href');
//                    // Getting Content
//                    getModalContent(href, true, 'article');
//                });
//                $('#modal', '.article-view').on('click', '#next-article', function (e) {
//                    e.preventDefault();
//                    var href = $(this).attr('href');
//                    // Getting Content
//                    getModalContent(href, true, 'article');
//                });
//                $('#modal', '.video-view').on('click', '#prev-article', function (e) {
//                    e.preventDefault();
//                    var href = $(this).attr('href');
//                    // Getting Content
//                    getModalContent(href, true, 'video');
//                });
//                $('#modal', '.video-view').on('click', '#next-article', function (e) {
//                    e.preventDefault();
//                    var href = $(this).attr('href');
//                    // Getting Content
//                    getModalContent(href, true, 'video');
//                });
//
//
//                $('#modal', '.article-view').on('click', '#close-modal', function (e) {
//                    e.preventDefault();
//                    var href = $(this).attr('href');
//                    if (History.getState().data.modal === 1) { //only true if triggered from article link (not direct visits to article)
//                        if (History.getState().data.origin === 'page') {
//                            if($('body').hasClass('video-view')) {
//                                destroyVideoModal();
//                            } else if ($('body').hasClass('values-view')) {
//                                destroyValuesModal();
//                            } else if ($('body').hasClass('events-view')) {
//                                destroyEventsModal();
//                                console.log('destroyEventsModal');
//                            } else {
//                                destroyModal();
//                            }
//
//                            var rewrite = History.getState().data.close;
//                            History.pushState(null, null, rewrite);
//                        } else {
//                            window.location.href = href;
//                        }
//
//                    } else if ($('#modal-wrapper').hasClass('article')) {
//                        window.location.href = href;
//                    }
//                });
//
//                //$('#modal', '.video-view').on('click', '#close-modal', function (e) {
//                //    e.preventDefault();
//                //
//                //    var href = $(this).attr('href');
//                //    if (History.getState().data.modal === 1) { //only true if triggered from article link (not direct visits to article)
//                //        if (History.getState().data.origin === 'page') {
//                //            destroyVideoModal();
//                //            var rewrite = History.getState().data.close;
//                //            History.pushState(null, null, rewrite);
//                //        } else {
//                //            window.location.href = href;
//                //        }
//                //
//                //    } else if ($('#modal-wrapper').hasClass('article')) {
//                //        window.location.href = href;
//                //    }
//                //});
//                $('a.external').click(function(e){
//                    e.preventDefault();
//                    var href = $(this).attr('href');
//                    showLeaveSiteModal();
//                    $('#offsite-modal #forward-to').attr('href',href);
//                    $('#destination').text(href);
//                    console.log(href);
//                    if ($('#modal').is(':visible')) {
//                        $('#modal').hide();
//                        $('body').addClass('hold-modal');
//                    }
//                    var modalHeight = $('#offsite-modal').height();
//                    var screenHeight = $(window).height();
//                    console.log(modalHeight);
//                    var topHeight = .5*(screenHeight-modalHeight);
//                    $('#offsite-modal').css({'top': topHeight +'px'});
//                });
//            });
//            if(addEntry === true) {
//                // Add History Entry using pushState
//
//                History.pushState({ modal : 1, origin : originType, close : originUrl }, null, url);
//                console.log(History.getState().data);
//
//            }
//    });
//}


