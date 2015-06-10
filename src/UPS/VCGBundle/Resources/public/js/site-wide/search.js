$(document).ready(function(){
    $('#job-search').submit(function(e){
        e.preventDefault();
        console.log('search');
        input = $('#search-field').val();
        location.href= 'http://jobs-ups.com/search/' + encodeURIComponent(input) + '/ASCategory/-1/ASPostedDate/-1/ASCountry/-1/ASState/-1/ASCity/-1/ASLocation/-1/ASCompanyName/-1/ASCustom1/-1/ASCustom2/-1/ASCustom3/-1/ASCustom4/-1/ASCustom5/-1/ASIsRadius/false/ASCityStateZipcode/-1/ASDistance/-1/ASLatitude/-1/ASLongitude/-1/ASDistanceType/-1';
    });
});
