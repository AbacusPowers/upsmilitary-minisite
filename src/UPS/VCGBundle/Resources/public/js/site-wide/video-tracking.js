$('document').ready(function(e){
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
});
    //----------YOUTUBE IFRAME EVENT TRACKING------------------//

var playerArray = new Array();
var counter = 0;
var readyCount = 0;
var videoCount;
var refreshIntervalId;

function onYouTubeIframeAPIReady() {
  videoCount = $('.yt-video').length;
  $('.yt-video').each(function(){
    var video = $(this).attr('src');
    var reg = /(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=))([\w-]{10,12})/g;
    var vidId = reg.exec(video)[1];
    var new_src = ((/\?/g.exec(video)) ? video + '&enablejsapi=1' : video + '?&enablejsapi=1');
    $(this).attr('src', new_src);
    $(this).attr('id', vidId);
    var originSrc = window.location.hostname;
    playerArray[counter] = new YT.Player(vidId, {
      videoId: vidId,
      playerVars: {
        'autohide': 1,
        'enablejsapi': 1,
        'origin': originSrc
      },
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
    counter++;
  });
}

function onPlayerReady(event) {
  readyCount++;
  if (readyCount == videoCount){
    for(var i = 0; i<playerArray.length; i++){
      playerArray[i].video_title = playerArray[i].B.videoData.title;
      playerArray[i].video_paused = true;
    }
  }
}

function trackDuration(event, title){
    var duration = parseInt(event.target.getDuration()),
        oneQuarter = Math.floor(duration/4),
        half = Math.floor(duration/2),
        threeQuarter = Math.floor(oneQuarter*3);

        refreshIntervalId = setInterval(function(){
            var currentTime = parseInt(event.target.getCurrentTime());
            switch (currentTime) {
                case oneQuarter:
                    ga('send', 'event', 'video', '25_percent', title);
                    break;
                case half:
                    ga('send', 'event', 'video', '50_percent', title);
                    break;
                case threeQuarter:
                    ga('send', 'event', 'video', '75_percent', title);
                    break;
            }
    }, 1000);
}

function onPlayerStateChange(event) {
    var thisVideoTitle = event.target.video_title;

    switch (event.data) {
        case YT.PlayerState.PLAYING:
            ga('send', 'event', 'video', 'play', thisVideoTitle);
            event.target.video_paused = false;
            trackDuration(event, thisVideoTitle);
            break;
        case YT.PlayerState.ENDED:
            ga('send', 'event', 'video', 'complete', thisVideoTitle);
            window.clearInterval(refreshIntervalId);
            break;
        case YT.PlayerState.PAUSED:
            if (event.target.video_paused != true) {
                ga('send', 'event', 'video', 'pause', thisVideoTitle);
                event.target.video_paused = true;
                window.clearInterval(refreshIntervalId);
            }
            break;
    }
}
