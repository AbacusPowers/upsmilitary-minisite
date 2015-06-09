$(document).ready(function(){
    var linkWidth = $('.video-link').width();
    var linkNum = $('.video-link').length;
    $('#video-list').width(linkWidth * linkNum);
    var eventWidth = $('.event__wrapper').width();
    var eventNum = $('.event__wrapper').length;
    $('.all-events-wrapper').width(eventWidth * eventNum);
});
