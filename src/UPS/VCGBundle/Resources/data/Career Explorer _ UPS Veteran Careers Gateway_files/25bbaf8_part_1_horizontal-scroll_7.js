$(document).ready(function(){
    var linkWidth = $('.video-link').width();
    var linkNum = $('.video-link').length;
    $('#video-list').width((linkWidth * linkNum) + 15);
    var eventWidth = $('.event__wrapper').width();
    var eventNum = $('.event__wrapper').length +1;
    $('.all-events-wrapper').width(eventWidth * eventNum);
});
