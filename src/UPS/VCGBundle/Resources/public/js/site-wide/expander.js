$('document').ready(function(){
    $('.expand-button','.veteranGateway').click(function(){
        $height = $(this).siblings('.hidden-part').children('.expander__child').height();
        $(this).parent('.expander__wrapper').addClass('open-expander');
        $(this).siblings('.hidden-part').velocity({height: $height}, 400).velocity({opacity: 1});
        $(this).hide();
        $(this).siblings('.hide-button').show();
    });
    $('.hide-button','.veteranGateway').click(function(){
        $(this).parent('.expander__wrapper').removeClass('open-expander');
        $(this).siblings('.hidden-part').velocity({opacity: 0}).velocity({height: 0}, 400);
        $(this).hide();
        $(this).siblings('.expand-button').show();
    });
    $('#modal').on('click','.expand-button',function(){
        $height = $(this).siblings('.hidden-part').children('.expander__child').height();
        $(this).parent('.expander__wrapper').addClass('open-expander');
        $(this).siblings('.hidden-part').velocity({height: $height}, 400).velocity({opacity: 1});
        $(this).hide();
        $(this).siblings('.hide-button').show();
    });
    $('#modal').on('click','.hide-button',function(){
        $(this).parent('.expander__wrapper').removeClass('open-expander');
        $(this).siblings('.hidden-part').velocity({opacity: 0}).velocity({height: 0}, 400);
        $(this).hide();
        $(this).siblings('.expand-button').show();
    });
});