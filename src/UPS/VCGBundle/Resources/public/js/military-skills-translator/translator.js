/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function aContainsB (a, b) {
    return a.indexOf(b) >= 0;
}


var bucketDescriptions = [];
bucketDescriptions[0] = 'Bucket 0 description';
bucketDescriptions[1] = 'Bucket 1 description';
bucketDescriptions[2] = 'Bucket 2 description';
bucketDescriptions[3] = 'Bucket 3 description';
bucketDescriptions[4] = 'Bucket 4 description';
bucketDescriptions[5] = 'Bucket 5 description';
bucketDescriptions[6] = 'Bucket 7 description';
bucketDescriptions[7] = 'Bucket 8 description';
bucketDescriptions[8] = 'Bucket 8 description';
bucketDescriptions[9] = 'Bucket 9 description';


function search(nameKey, myArray){
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i].Search === nameKey) {
            return myArray[i];
        }
    }
}

function buildHints(branchKey, myArray){
    var hints = [];
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i].Branch === branchKey) {
            hints.push(myArray[i].Search);
        }
    }
    console.log(hints);
    return hints;
}

function checkBranch(val){
    console.log('changed');
    if(hints.indexOf( val ) < 0) {
        $('#form-error').text('Please choose from the list of suggestions.');
        $('#form-error').removeClass('hidden');
        $('input[type="submit"]').prop('disabled',false);
    } else {
        $('#form-error').addClass('hidden');
    }
    console.log('value: ' + val + ' matches item ' + hints.indexOf(val));
}
$( document ).ready(function() {
    $.get("/bundles/vcg/data/new-jobs-data.csv", function(data){
        //        console.log(data);
        allJobs = $.csv.toObjects(data);

    });

    $('#branch-of-service').change(function(){
        var val = $(this).val();
        $('#job-code').val('');
        $('#job-code').prop('disabled',false).removeClass('disabled-input');
        $('label[for="job-code"]').removeClass('disabled-input');

        hints = buildHints(val,allJobs);
        $('#job-code').autocomplete({
            source: hints,
            select: function(event, ui) {
                checkBranch(ui.item.value);
            }
        });
    });
    $('#job-code').on('input',function(){
        var val = $(this).val();
        checkBranch(val);
    });
    $('#branch-of-service').on('autocompletechange',function(){
        var val = $(this).val();
        checkBranch(val);
    });
    //

    //$('#military-skills-translator').submit(function(e){
    //    e.preventDefault();
    //    $('.expander__wrapper').addClass('hidden');
    //    $('#side--a').addClass('full-width');
    //    $('#form-error').addClass('hidden');
    //    $('#form-error').text('');
    //    $('#military-job').addClass('hidden');
    //    $('#job-types').addClass('hidden');
    //    $('.component--expander').addClass('hidden');
    //
    //
    //    var branch = $('#branch-of-service').val();
    //    var jobCode = $('#job-code').val();
    //
    //    /**
    //     * GA TRACKING
    //     */
    //        //ga('send','event','military_skills_translator','translate', branch + '_' + jobCode);
    //
    //    if(hints.indexOf(jobCode) >= 0) {
    //        $.get("/bundles/vcg/data/new-jobs-data.csv", function(data){
    ////        console.log(data);
    //        allJobs = $.csv.toObjects(data);
    //
    //        })
    //        .done(function(){
    //            var matched = false;
    //            allJobs.some(function(obj){
    //                console.log('first search');
    //
    //                if( obj['Code'] && aContainsB(jobCode, obj['Code']) ) {
    //
    //                    var match = obj;
    //                    if(match['Branch'] === branch){
    //                        $('#military-job').removeClass('hidden');
    //                        $('#job-types').removeClass('hidden');
    //                        $('.component--expander').removeClass('hidden');
    //                        //$('#military-job-title').text(match["MOS title"]);
    //                        //$('#military-job-description').text(match["MOS description"]);
    //                        $('#side--a').removeClass('full-width');
    //                        var bucket = match['Bucket'];
    //                        $('.bucket-match .expander__parent').text(bucket);
    //
    //                        //if (match['Package Handler'] === 'Y') {
    //                        //    $('.hidden-part[data-id="1"]').parent('.expander__wrapper').removeClass('hidden');
    //                        //}
    //                        //if (match['Driver Helper'] === 'Y') {
    //                        //    $('.hidden-part[data-id="2"]').parent('.expander__wrapper').removeClass('hidden');
    //                        //}
    //                        //if (match['Package Delivery Driver'] === 'Y') {
    //                        //    $('.hidden-part[data-id="3"]').parent('.expander__wrapper').removeClass('hidden');
    //                        //}
    //                        //if (match['Warehouse Associate'] === 'Y') {
    //                        //    $('.hidden-part[data-id="8"]').parent('.expander__wrapper').removeClass('hidden');
    //                        //}
    //                        //if (match['Automotive Mechanic'] === 'Y') {
    //                        //    $('.hidden-part[data-id="5"]').parent('.expander__wrapper').removeClass('hidden');
    //                        //}
    //                        //if (match['Facilities Mechanic'] === 'Y') {
    //                        //    $('.hidden-part[data-id="6"]').parent('.expander__wrapper').removeClass('hidden');
    //                        //}
    //                        //if (match['Feeder Driver'] === 'Y') {
    //                        //    $('.hidden-part[data-id="4"]').parent('.expander__wrapper').removeClass('hidden');
    //                        //}
    //                        //if (match['UPS Freight Over-the-Road (OTR) Driver'] === 'Y') {
    //                        //    $('.hidden-part[data-id="9"]').parent('.expander__wrapper').removeClass('hidden');
    //                        //}
    //                        //if (match['Part-Time Operations Supervisor'] === 'Y') {
    //                        //    $('.hidden-part[data-id="10"]').parent('.expander__wrapper').removeClass('hidden');
    //                        //}
    //                        //if (match['Business Analyst'] === 'Y') {
    //                        //    $('.hidden-part[data-id="11"]').parent('.expander__wrapper').removeClass('hidden');
    //                        //}
    //                        //if (match['Sales Representative'] === 'Y') {
    //                        //    $('.hidden-part[data-id="7"]').parent('.expander__wrapper').removeClass('hidden');
    //                        //}
    //                    } else {
    //                        $('#form-error').text('Sorry, this job does not match branch of service.');
    //                        $('#form-error').removeClass('hidden');
    //                    }
    //                    matched = true;
    //                    return true;
    //                    console.log(match);
    //                }
    //            });
    //            if (matched === false) {
    //                allJobs.some(function(obj){
    //                    console.log('second search');
    //                    if((obj['Branch'] === branch) && aContainsB(jobCode, obj['MOS title'])) {
    //
    //                        var match = obj;
    //                        console.log(match);
    //                        if(match['Branch'] === branch){
    //                            $('#military-job-title').text(match["MOS title"]);
    //                            $('#military-job-description').text(match["MOS description"]);
    //                            console.log(match['Package Handler']);
    //
    //                            if (match['Package Handler'] === 'Y') {
    //                                $('.hidden-part[data-id="1"]').parent('.expander__wrapper').removeClass('hidden');
    //                            }
    //                            if (match['Driver Helper'] === 'Y') {
    //                                $('.hidden-part[data-id="2"]').parent('.expander__wrapper').removeClass('hidden');
    //                            }
    //                            if (match['Package Delivery Driver'] === 'Y') {
    //                                $('.hidden-part[data-id="3"]').parent('.expander__wrapper').removeClass('hidden');
    //                            }
    //                            if (match['Warehouse Associate'] === 'Y') {
    //                                $('.hidden-part[data-id="8"]').parent('.expander__wrapper').removeClass('hidden');
    //                            }
    //                            if (match['Automotive Mechanic'] === 'Y') {
    //                                $('.hidden-part[data-id="5"]').parent('.expander__wrapper').removeClass('hidden');
    //                            }
    //                            if (match['Facilities Mechanic'] === 'Y') {
    //                                $('.hidden-part[data-id="6"]').parent('.expander__wrapper').removeClass('hidden');
    //                            }
    //                            if (match['Feeder Driver'] === 'Y') {
    //                                $('.hidden-part[data-id="4"]').parent('.expander__wrapper').removeClass('hidden');
    //                            }
    //                            if (match['UPS Freight Over-the-Road (OTR) Driver'] === 'Y') {
    //                                $('.hidden-part[data-id="9"]').parent('.expander__wrapper').removeClass('hidden');
    //                            }
    //                            if (match['Part-Time Operations Supervisor'] === 'Y') {
    //                                $('.hidden-part[data-id="10"]').parent('.expander__wrapper').removeClass('hidden');
    //                            }
    //                            if (match['Business Analyst'] === 'Y') {
    //                                $('.hidden-part[data-id="11"]').parent('.expander__wrapper').removeClass('hidden');
    //                            }
    //                            if (match['Sales Representative'] === 'Y') {
    //                                $('.hidden-part[data-id="7"]').parent('.expander__wrapper').removeClass('hidden');
    //                            }
    //                        } else {
    //                            $('#form-error').text('Job does not match branch of service.');
    //                            $('#form-error').removeClass('hidden');
    //                        }
    //
    //                        return true;
    //
    //                    }
    //                });
    //            }
    //        });
    //    } else {
    //        $('#form-error').text('Please use a job from the list of suggestions.');
    //        $('#form-error').removeClass('hidden');
    //    }
    //});
});

//
//$(document)
//  .ajaxStart(function () {
//    $('#ajax-spinner').removeClass('hidden');
//  })
//  .ajaxStop(function () {
//    $('#ajax-spinner').addClass('hidden');
//  });