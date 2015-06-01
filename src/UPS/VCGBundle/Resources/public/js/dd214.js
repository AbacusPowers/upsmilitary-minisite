/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$( function(){

  $('.button').hover(function(){
    var id = $(this).attr('data-id');
    $('#'+id).fadeToggle();
    console.log('fade in' + id);
  });
  
} );