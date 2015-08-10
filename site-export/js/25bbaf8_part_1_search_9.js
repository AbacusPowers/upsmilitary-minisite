$(document).ready(function(){
    $('#job-search').submit(function(e){
        e.preventDefault();
        //console.log('search');
        var input = $('#search-field').val();

        var forwardURL = 'https://www.jobs-ups.com/search-jobs/' + encodeURIComponent(input) + '/1187/1';

        window.open(
            forwardURL,
            '_blank' // <- This is what makes it open in a new window.
        );
    });
});
