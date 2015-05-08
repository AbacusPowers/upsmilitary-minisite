//$(function() {
//  $("#modal-1").on("change", function() {
//    if ($(this).is(":checked")) {
//      $("body").addClass("modal-open");
//    } else {
//      $("body").removeClass("modal-open");
//    }
//  });
//
//  $(".modal-fade-screen, .modal-close").on("click", function() {
//    $(".modal-state:checked").prop("checked", false).change();
//  });
//
//  $(".modal-inner").on("click", function(e) {
//    e.stopPropagation();
//  });
//});


$('document').ready(function(){

    $('.article-link').on('click', function(e){
        e.preventDefault();
        var href = $(this).attr('href');

        // Getting Content
        getContent(href, true);

        $('.historyAPI').removeClass('active');
        $(this).addClass('active');
        
        $('#overlay').show();
        $('#modal').fadeIn();
        $('body').addClass('article-view');
    });

    $('#close-modal').click(function(){
        $('#overlay').hide();
        $('#modal').hide();
        $('body').removeClass('article-view');
    });
});

// Adding popstate event listener to handle browser back button
window.addEventListener("popstate", function(e) {

    // Get State value using e.state
    getContent(location.pathname, false);
});

function getContent(url, addEntry) {
    $.get(url)
    .done(function( data ) {

        // Updating Content on Page
        $('#modal-content').html(data);

        if(addEntry === true) {
            // Add History Entry using pushState
            history.pushState(null, null, url);
        }

    });
}