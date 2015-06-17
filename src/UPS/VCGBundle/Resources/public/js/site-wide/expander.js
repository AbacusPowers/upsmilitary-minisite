$('document').ready(function(){

    $('.expand-button','.veteranGateway').click(function(){
        $(this).parent('.expander__wrapper').toggleClass('open-expander');
        $(this).siblings('.hidden-part').slideToggle();
        $(this).children('i.fa').toggleClass('fa-plus').toggleClass('fa-minus');
    });
    $('#modal').on('click','.expand-button',function(){
        $(this).parent('.expander__wrapper').toggleClass('open-expander');
        $(this).siblings('.hidden-part').slideToggle();
        $(this).children('i.fa').toggleClass('fa-plus').toggleClass('fa-minus');
    });
    //$('.hide-button','.veteranGateway').click(function(){
    //    $(this).parent('.expander__wrapper').removeClass('open-expander');
    //    $(this).siblings('.hidden-part').slideUp();
    //    //$(this).siblings('.hidden-part').velocity("transition.slideUpBigOut");
    //    //$(this).hide();
    //    //$(this).siblings('.expand-button').show();
    //    $(this).removeClass('hide-button').addClass('expand-button');
    //    $('i.fa',this).removeClass('fa-minus').addClass('fa-plus');
    //});

    //$('#modal').on('click','.expand-button',function(){
    //    $height = $(this).siblings('.hidden-part').children('.expander__child').height();
    //    $(this).parent('.expander__wrapper').addClass('open-expander');
    //    $(this).siblings('.hidden-part').slideDown();
    //    $(this).hide();
    //    $(this).siblings('.hide-button').show();
    //});
    //$('#modal').on('click','.hide-button',function(){
    //    $(this).parent('.expander__wrapper').removeClass('open-expander');
    //    $(this).siblings('.hidden-part').slideUp();
    //    $(this).hide();
    //    $(this).siblings('.expand-button').show();
    //});
    //$('.expander__parent').addClass('bellows__header');
    //$('.expander__wrapper').addClass('bellows__item');
    //$('.component--expander').bellows();
});
