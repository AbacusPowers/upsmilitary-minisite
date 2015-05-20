
$('document').ready(function(){
    
    $('.article-link').on('click', function(e){
        e.preventDefault();
        var href = $(this).attr('href');
        // Getting Content
        getModalContent(href, true, 'page');
        showModal();

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
    $('#modal').on('click','#close-modal', function(e){
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

function destroyModal(){
    $('#overlay').hide();
    $('#modal').hide();
    $('body').removeClass('article-view');
    $('#modal-wrapper').removeClass('article');
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