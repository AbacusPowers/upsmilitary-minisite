/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$( function(){

  $('.button').mouseover(function(){
    var id = $(this).attr('data-id');
    var svg = Snap.select('#block'+id);
    svg.animate({'opacity': 1}, 300);
      console.log('fade in' + id);
    console.log(svg);
  });
  $('.button').mouseout(function(){
    var id = $(this).attr('data-id');
    var svg = Snap.select('#block'+id);
    svg.animate({'opacity': 0}, 300);
      console.log('fade in' + id);
    console.log(svg);
  });
  
} );