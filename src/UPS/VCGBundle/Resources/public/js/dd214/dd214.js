
$( function(){
    //ANIMATE SVGS
    // requires snap.svg
    $('.button','.page--ddform214').mouseover(function(){
        var id = $(this).attr('data-id');
        var svg = Snap.select('#block'+id);
        if (svg){
            svg.animate({'opacity': 1}, 300);
        }
    });
    $('.button','.page--ddform214').mouseout(function(){
        var id = $(this).attr('data-id');
        var svg = Snap.select('#block'+id);
        if (svg) {
            if (!$(this).parent('.expander__wrapper').hasClass('open-expander')){
                svg.animate({'opacity': 0}, 300);
            }
        }

    });
  
} );

$( function(){
    //ANIMATE SVGS
    // requires snap.svg
    $('.expand-button','.page--ddform214').click(function(){
        var id = $(this).attr('data-id');
        var svg = Snap.select('#block'+id);
        if (svg) {
            svg.animate({'opacity': 1}, 300);
        }
    });
    $('.hide-button','.page--ddform214').click(function(){
        var id = $(this).attr('data-id');
        var svg = Snap.select('#block'+id);
        if (svg) {
            svg.animate({'opacity': 0}, 300);
        }
    });

});

$( function(){
    //ANIMATE SVGS
    // requires snap.svg
    $('.svg-target').hover(
        function(){ //in
            var id = $(this).attr('data-id');
            $('.button[data-id="'+ id +'"]').addClass('hover');
            var svg = Snap.select('#block'+id);
            if (svg) {
                svg.animate({'opacity': 1}, 300);
            }
        },
        function(){ //out
            var id = $(this).attr('data-id');
            $('.button[data-id="'+ id +'"]').removeClass('hover');
            var svg = Snap.select('#block'+id);
            if (svg) {
                if(!$(this).parent('.expander__wrapper').hasClass('open-expander')){
                    svg.animate({'opacity': 0}, 300);
                }
            }
        });
});
$( function(){
    $('.svg-target','.page--ddform214').click(function(){
        var id = $(this).attr('data-id');
        target = $('.button[data-id="'+id+'"]');
        target.parent('.expander__wrapper').toggleClass('open-expander');
        target.siblings('.hidden-part').slideToggle();
        target.children('i.fa').toggleClass('fa-plus').toggleClass('fa-minus');

        var svg = Snap.select('#block'+id);
        if (svg) {
            if(target.hasClass('expand-button')) {
                svg.animate({'opacity': 1}, 300);
            } else if (target.hasClass('hide-button')) {
                svg.animate({'opacity': 0}, 300);
            }
        }

    });

});


$(document).ready( function(){
    //STICKY!
    //requires sticky-kit

        $("section.dd-form214").stick_in_parent({recalc_every: 1, bottoming: true});
        //console.log('bbb1');

    $('.expander__wrapper','html:not(.breakpoint-small)').on('classChange', function() {
        //console.log('ahhh!');
        var columnHeight = $('#side--b').height();
        $('#side--a').css('min-height', columnHeight).trigger("sticky_kit:recalc");
    });
});
