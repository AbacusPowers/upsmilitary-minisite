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