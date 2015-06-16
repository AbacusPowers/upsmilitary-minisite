
// $( document ).ready(function() {
//     /**
//      * CENTER IMAGES ON PAGE LOAD
//      */
//     WindowWidth = $(window).width();
//     ItemWidth = $('.carousel-item img').width();

//     NegMargin = -(ItemWidth - WindowWidth)/2;
//     $('.carousel-item img').css('margin-left', NegMargin);

//     /**
//      * AUTO ROTATE
//      */
//     var elements = $('.carousel-inner input[type="radio"]');
//     var index = 0;

//     var doNext = null;
//     doNext = function() {
//         //if(item)index = item;

//         var element = elements.eq(index);
//         var x = setTimeout(doNext, 6000);
//         // do work

//         $('.carousel-inner input[type="radio"]').change(function(){
//             newIndex = $(this).index('.carousel-inner input[type="radio"]');
//             index = newIndex;
//         });

//         element.prop('checked',true);
//         if (index < elements.length) {
//             index++;
//             x;
//         } else {
//             index = 0;
//             x;
//         }
//     }
//     doNext();


// });

/**
 * CENTER IMAGES ON WINDOW RESIZE
 */
$( window ).resize(function() {
    WindowWidth = $(window).width();
    ItemWidth = $('.carousel-item img').width();

    NegMargin = -(ItemWidth - WindowWidth)/2;
   $('.carousel-item img').css('margin-left', NegMargin);
});