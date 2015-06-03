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
        showEventsModal();
    });
    $('#modal').on('click','#prev-article',function(e){
        e.preventDefault();
            var href = $(this).attr('href');
            // Getting Content
            getModalContent(href, true, 'article');
    });
    $('#modal').on('click','#next-article',function(e){
        e.preventDefault();
            var href = $(this).attr('href');
            // Getting Content
            getModalContent(href, true, 'article');
    });
    $('#modal','.article-view').on('click','#close-modal', function(e){
        e.preventDefault();
        console.log('ping');
        var href = $(this).attr('href');
        if(History.getState().data.modal === 1) { //only true if triggered from article link (not direct visits to article)
            if(History.getState().data.origin === 'page') {
                destroyModal();
                var rewrite = History.getState().data.close;
                History.pushState(null, null, rewrite);
            } else {
                window.location.href = href;
            }
            
        } else if ($('#modal-wrapper').hasClass('article')) {
            window.location.href = href;
        }
    });
    $('#modal','.video-view').on('click','#close-modal', function(e){
        e.preventDefault();
        console.log('ping');
        var href = $(this).attr('href');
        if(History.getState().data.modal === 1) { //only true if triggered from article link (not direct visits to article)
            if(History.getState().data.origin === 'page') {
                destroyModal();
                var rewrite = History.getState().data.close;
                History.pushState(null, null, rewrite);
            } else {
                window.location.href = href;
            }
            
        } else if ($('#modal-wrapper').hasClass('article')) {
            window.location.href = href;
        }
    });
});
function getModalContent(url, addEntry, originType) {
    $.get(url)
    .done(function() {
        var originUrl = document.URL;
        // Updating Content on Page
        $('#modal').load(url +' #modal-content');
        if(addEntry === true) {
            // Add History Entry using pushState
            History.pushState({ modal : 1, origin : originType, close : originUrl }, null, url);
        }  
    });
}

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
function showEventsModal(){
    $('#overlay').show();
    $('#modal').fadeIn();
    $('body').addClass('events-view');
    $('#modal-wrapper').addClass('events');
}
function showLeaveSiteModal(){
    $('#overlay').show();
    $('#modal').fadeIn();
    $('body').addClass('leave-site-view');
    $('#modal-wrapper').addClass('leave-site');
}
function destroyModal(){
    $('#overlay').hide();
    $('#modal').hide();
    $('body').removeClass('article-view');
    $('#modal-wrapper').removeClass('article');
}
function destroyVideoModal(){
    $('#overlay').hide();
    $('#modal').hide();
    $('body').removeClass('video-view');
    $('#modal-wrapper').removeClass('video');
}
function destroyEventsModal(){
    $('#overlay').hide();
    $('#modal').hide();
    $('body').removeClass('events-view');
    $('#modal-wrapper').removeClass('events');
}
function destroyLeaveSiteModal(){
    $('#overlay').hide();
    $('#modal').hide();
    $('body').removeClass('leave-site-view');
    $('#modal-wrapper').removeClass('leave-site');
}

(function(window, undefined) {
    History.Adapter.bind(window,'statechange',function(){ // Note: We are using statechange instead of popstate
//        if(State.data.modal !== 1) {
//            destroyModal();
//            console.log('ping');
//        } else {
//            showModal();
//            console.log('ding');
//        }
    });
})(window);

//$( function(){
//    var isExternalRegexClosure = (function(){
//        var domainRe = /https?:\/\/((?:[\w\d]+\.)+[\w\d]{2,})/i; 
//        
//        return function(url) {
//            function domain(url) {
//                var result = domainRe.exec(url);
//                return result[1];
//            }
//
//            return domain(location.href) !== domain(url);
//        };
//    })();
//    
//    $('a').click(function(e){
//        var href = $(this).attr('href');
//        if (isExternalRegexClosure(href)){
//            e.preventDefault();
//            console.log('external');
//            var leave = confirm("You are about to leave the jobs.ups.com site");
//            if (leave) {
//                
//            }
//            // Getting Content
////            getModalContent(href, true, 'page');
////            showLeaveSiteModal();
//        } else {
//            console.log('internal');
//        }
//        
//    });
//    
//} );