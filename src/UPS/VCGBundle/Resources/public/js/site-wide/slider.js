
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
    var elements = $('input[type="radio"]','.carousel-inner');
    var index = 0;

    var doNext = null;
    doNext = function() {
        var element = elements.eq(index);
        // do work
        element.prop('checked',true);
        if (index < elements.length) {
            index++;
            setTimeout(doNext, 6000);
        } else {
            index = 0;
            setTimeout(doNext, 6000);
        }
    }
    doNext();
});

/**
 * CENTER IMAGES ON WINDOW RESIZE
 */
$( window ).resize(function() {
    WindowWidth = $(window).width();
    ItemWidth = $('.carousel-item img').width();

    NegMargin = -(ItemWidth - WindowWidth)/2;
   $('.carousel-item img').css('margin-left', NegMargin);
});