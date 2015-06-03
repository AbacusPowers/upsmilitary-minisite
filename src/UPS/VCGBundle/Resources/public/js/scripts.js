/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
$('#search-submit').click(function(e, input) {
    e.preventDefault();
    input = $('#search-field').val();
    location.href= 'http://jobs-ups.com/search/' + input + '/ASCategory/-1/ASPostedDate/-1/ASCountry/-1/ASState/-1/ASCity/-1/ASLocation/-1/ASCompanyName/-1/ASCustom1/-1/ASCustom2/-1/ASCustom3/-1/ASCustom4/-1/ASCustom5/-1/ASIsRadius/false/ASCityStateZipcode/-1/ASDistance/-1/ASLatitude/-1/ASLongitude/-1/ASDistanceType/-1';
});
$('#job-search').submit(function(){
    input = $('#search-field').val();
    location.href= 'http://jobs-ups.com/search/' + input + '/ASCategory/-1/ASPostedDate/-1/ASCountry/-1/ASState/-1/ASCity/-1/ASLocation/-1/ASCompanyName/-1/ASCustom1/-1/ASCustom2/-1/ASCustom3/-1/ASCustom4/-1/ASCustom5/-1/ASIsRadius/false/ASCityStateZipcode/-1/ASDistance/-1/ASLatitude/-1/ASLongitude/-1/ASDistanceType/-1';
});
//$(window).bind('beforeunload', function(){
//  return 'Are you sure you want to leave?';
//});
//
//$(window).unload(function(){
//  alert('Bye.');
//});