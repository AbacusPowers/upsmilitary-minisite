$('document').ready(function(){

    $('.article-link').on('click', function(e){
        e.preventDefault();
        var href = $(this).attr('href');
        // Getting Content
        getModalContent(href, true);
        showModal();

    });
    $('.article-link').on('click', function(e){
        e.preventDefault();
        var href = $(this).attr('href');
        // Getting Content
        getModalContent(href, true);
        showModal();
    });

});
function showModal(){
    $('#overlay').show();
    $('#modal').fadeIn();
    $('body').addClass('article-view');
}
function closeModal(){
    destroyModal();
    History.back();
}
function destroyModal(){
    $('#overlay').hide();
    $('#modal').hide();
    $('body').removeClass('article-view');
}

$('#modal').on('click','#close-modal', function(e){
    var State = History.getState();
    var href = $(this).attr('href');
        console.log(State.data.modal);
    if(State.data.modal === 1) { //only true if triggered from article link (not direct visits to article)
        e.preventDefault();
        closeModal();
        console.log('close it!');
    }
});


(function(window, undefined) {
    
    History.Adapter.bind(window,'statechange',function(){ // Note: We are using statechange instead of popstate
        // Log the State
        var State = History.getState(); // Note: We are using History.getState() instead of event.state
        History.log('statechange:', State.data, State.title, State.url);
        if(State.data.modal !== 1) {
            destroyModal();
        } else {
            showModal();
        }
        console.log(State.data.modal);
    });
})(window);

function getModalContent(url, addEntry) {
    $.get(url)
    .done(function() {
        
        // Updating Content on Page
        $('#modal').load(url +' #modal-content');
        if(addEntry === true) {
            // Add History Entry using pushState
            History.pushState({modal: 1}, null, url);
        }
//        console.log(history.state);
    });
}