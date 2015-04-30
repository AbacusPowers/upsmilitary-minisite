// Giovanni Version

$( function(){

  'use strict';

  var $showButton = $('.expander__wrapper .expand-button'),
      $hideButton = $('.expander__wrapper .hide-button');

  $showButton.click(function(){
    var id = $(this).attr('data-id');
      var height = $('.hidden-part[data-id="'+id+'"] .expander__child').height();
        height = height+25;/*Adds extra padding to the bottom*/
        
    $(this).velocity({opacity:0})
      .css('z-index',1)
      .next('.hide-button')
      .velocity({opacity:1})
      .css('z-index',2)
      .next('.hidden-part')
      .velocity({height:height});
      $('.hidden-part[data-id="'+id+'"] *').velocity({opacity:1},{duration:400}); 
  });

  $hideButton.click(function(){
    var id = $(this).attr('data-id');
    $('.hidden-part[data-id="'+id+'"] *').velocity({opacity:0},{duration:200}); 
    $(this).velocity({opacity:0})
      .css('z-index',1)
      .prev('.expand-button')
      .velocity({opacity:1})
      .css('z-index',2)
      .next()
      .next()
      .velocity({height:0});
  });
} );