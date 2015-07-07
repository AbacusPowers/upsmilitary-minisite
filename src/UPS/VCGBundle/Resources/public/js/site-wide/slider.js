
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
    var elements = $('.carousel-inner input[type="radio"]');
    var index = 0;
    var doNext = null;
    function sliderGo() {
        //if(item)index = item;
        breaker = false;
        var element = elements.eq(index);
        //var x = setTimeout(doNext, 6000);
        // do work

        $('.carousel-inner input[type="radio"]').change(function(){
            newIndex = $(this).index('.carousel-inner input[type="radio"]');
            index = newIndex;
        });

        element.prop('checked',true);
        //while (breaker == false) {
        if (index < elements.length) {
            index++;
            //x;
        } else {
            index = 0;
            //x;
        }
        //}
    }
    var slider = setInterval(sliderGo, 6000);
    //doNext();

    $('.carousel').on('click','.pause-slider',function() {
        clearInterval(slider);
        $(this).removeClass('pause-slider fa-pause').addClass('start-slider fa-play');
    });
    $('.carousel').on('click','.start-slider',function() {
        slider = setInterval(sliderGo, 6000);
        $(this).removeClass('start-slider fa-play').addClass('pause-slider fa-pause');
    });

});

/**
 * CENTER IMAGES ON WINDOW RESIZE
 */
//$( window ).resize(function() {
//   WindowWidth = $(window).width();
//   ItemWidth = $('.carousel-item img').width();
//
//   NegMargin = -(ItemWidth - WindowWidth)/2;
//   $('.carousel-item img').css('margin-left', NegMargin);
//});


