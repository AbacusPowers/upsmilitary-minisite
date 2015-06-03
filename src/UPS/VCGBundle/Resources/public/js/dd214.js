/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$( function(){

  $('.button','.page--ddform214').mouseover(function(){
    var id = $(this).attr('data-id');
    var svg = Snap.select('#block'+id);
    svg.animate({'opacity': 1}, 300);
  });
  $('.button','.page--ddform214').mouseout(function(){
    var id = $(this).attr('data-id');
    var svg = Snap.select('#block'+id);
    if(!$(this).parent('.expander__wrapper').hasClass('open-expander')){
        svg.animate({'opacity': 0}, 300);
    }
});
  
} );
$( function(){
    $('.expand-button','.page--ddform214').click(function(){
        var id = $(this).attr('data-id');
        var svg = Snap.select('#block'+id);
        svg.animate({'opacity': 1}, 300);
    });
    $('.hide-button','.page--ddform214').click(function(){
        var id = $(this).attr('data-id');
        var svg = Snap.select('#block'+id);
        svg.animate({'opacity': 0}, 300);
    });
});