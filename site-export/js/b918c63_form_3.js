/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function aContainsB (a, b) {
    return a.indexOf(b) >= 0;
}

$( document ).ready(function() {
     $('.job-search--job-description').submit(function(e){
        e.preventDefault();
        var jobTitle = $(this).closest('.expander__wrapper').find('.expander__parent').text();

        if (jobTitle == 'Driver Helper (October\u2013December)') {
            jobTitle = 'Driver Helper';
        }


        var forwardURL = 'https://www.jobs-ups.com/search-jobs/' + encodeURIComponent(jobTitle) + '/1187/1';
        window.open(
            forwardURL,
            '_blank' // <- This is what makes it open in a new window.
        );
    });

    $('.job-search--military-skills-translator').submit(function(e){
        e.preventDefault();
        jobTitle = $(this).closest('.expander__wrapper').find('.expander__parent').text();

        if (jobTitle == 'Driver Helper (October\u2013December)') {
            jobTitle = 'Driver Helper';
        }

        var forwardURL = 'https://www.jobs-ups.com/search-jobs/' + encodeURIComponent(jobTitle) + '/1187/1';

        window.open(
            forwardURL,
            '_blank' // <- This is what makes it open in a new window.
        );

    });
    

});

