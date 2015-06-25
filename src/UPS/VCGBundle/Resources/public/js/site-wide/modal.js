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
        getVideoModalContent(href, true, 'page');
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
    $(document).on('click', '.article #prev-article', function (e) {
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
    .on('click', '.article #next-article', function (e) {
        e.preventDefault();
        var href = $(this).attr('href');
        // Getting Content
        origin = History.getState().data.origin;
        console.log(origin);
        if ( origin == 'page') {
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
        if (History.getState().data.modal === 1) { //only true if triggered from article link (not direct visits to article)
            if (History.getState().data.origin === 'page') {
                if($('body').hasClass('video-view')) {
                    destroyVideoModal();
                } else if ($('body').hasClass('values-view')) {
                    destroyValuesModal();
                } else if ($('body').hasClass('events-view')) {
                    destroyEventsModal();
                    console.log('destroyEventsModal');
                } else {
                    destroyModal();
                }

                var rewrite = History.getState().data.close;
                History.pushState(null, null, rewrite);
            } else {
                console.log('one: ' + href);

                window.location.href = href;
            }

        } else if ($('#modal-wrapper').hasClass('article')) {
            window.location.href = href;
            console.log('two');
        }
    });
});

function getModalContent(url, addEntry, originType) {
    $('#modal').load(url +' #modal-content', null, function() {
        var originUrl = document.URL;
        if(addEntry === true) {
            var newTitle = $('#single-modal-content h1').text();
            document.title = newTitle;
        }

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
function showValuesModal(){
    $('#overlay').show();
    $('#modal').fadeIn();
    $('body').addClass('values-view');
    $('#modal-wrapper').addClass('values');
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

function getVideoModalContent(url, addEntry, originType) {
    var originUrl = document.URL;
    // Updating Content on Page
    $('#modal').load(url +' #modal-content', null, function() {

        if(addEntry === true) {
            var newTitle = $('#single-modal-content h1').text();
            document.title = newTitle;

            // Add History Entry using pushState

            History.pushState({ modal : 1, origin : originType, close : originUrl }, null, url);
            console.log(History.getState().data);

        }
    });
}
function getLeaveSiteModalContent(url, addEntry, originType) {
    $.get(url)
        .done(function() {
            var originUrl = document.URL;
            // Updating Content on Page
            $('#offsite-modal').load(url +' #modal-content', null, function(){
                //GET RID OF IDs ON THESE FUNCTIONS. NEED TO CHANGE IN HTML
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
                $('a.external').click(function(e){
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
                    var topHeight = 0.5*(screenHeight-modalHeight);
                    $('#offsite-modal').css({'top': topHeight +'px'});
                });

            });
            if(addEntry === true) {
                // Add History Entry using pushState
                History.pushState({ modal : 1, origin : originType, close : originUrl }, null, url);
                console.log(History.getState().data);
            }
        });
}
