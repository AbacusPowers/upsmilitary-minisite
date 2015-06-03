/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(window).bind('beforeunload', function(){
  return 'Are you sure you want to leave?';
});

$(window).unload(function(){
  alert('Bye.');
});