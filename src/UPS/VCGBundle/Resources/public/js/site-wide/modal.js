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
        destroyLeaveSiteModal();
        var href = $(this).attr('href');
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