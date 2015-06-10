/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/*
 * CENTER IMAGES ON PAGE LOAD
 */
$( document ).ready(function() {
    WindowWidth = $(window).width();
    ItemWidth = $('.carousel-item img').width();

    NegMargin = -(ItemWidth - WindowWidth)/2;
    $('.carousel-item img').css('margin-left', NegMargin);

    //var tid = setTimeout(rotateSlider, 2000);
    //function rotateSlider() {
    //    // do some stuff...
    //    $('')
    //    tid = setTimeout(rotateSlider, 2000); // repeat myself
    //}
    //function abortTimer() { // to be called when you want to stop the timer
    //    clearTimeout(tid);
    //}
    $('input[type="radio"]').each(function(){

    })
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

/*
 * CENTER IMAGES ON WINDOW RESIZE
 */
$( window ).resize(function() {
    WindowWidth = $(window).width();
    ItemWidth = $('.carousel-item img').width();

    NegMargin = -(ItemWidth - WindowWidth)/2;
   $('.carousel-item img').css('margin-left', NegMargin);
});