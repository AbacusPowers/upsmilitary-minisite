/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//var bucketDescriptions = [];
//bucketDescriptions[0] = 'Bucket 0 description';
//bucketDescriptions[1] = 'Bucket 1 description';
//bucketDescriptions[2] = 'Bucket 2 description';
//bucketDescriptions[3] = 'Bucket 3 description';
//bucketDescriptions[4] = 'Bucket 4 description';
//bucketDescriptions[5] = 'Bucket 5 description';
//bucketDescriptions[6] = 'Bucket 7 description';
//bucketDescriptions[7] = 'Bucket 8 description';
//bucketDescriptions[8] = 'Bucket 8 description';
//bucketDescriptions[9] = 'Bucket 9 description';

var buckets = [];
buckets[0] = {name: 'No direct match', description: 'No direct match available'};
buckets[1] = {name: 'Delivery Drivers', description: 'Delivery driver bucket description'};
buckets[2] = {name: 'Freight Drivers', description: 'Freight driver bucket description'};
buckets[3] = {name: 'Logistics', description: 'Logistics bucket description'};
buckets[4] = {name: 'Operations', description: 'Operations bucket description'};
buckets[5] = {name: 'Mechanics and Technicians', description: 'Mechanics and technicians bucket description'};
buckets[6] = {name: 'Administrative Workers', description: 'Admin bucket description'};
buckets[7] = {name: 'Professional Workers', description: 'Professional bucket description'};
buckets[8] = {name: 'Information Systems', description: 'Information systems bucket description'};
buckets[9] = {name: 'Air Operations', description: 'Air operations bucket description'};

var categories = {
    'Delivery Drivers': [
        'Driver',
        'Driver Helper',
        'Package Delivery Driver',
        'Part Time'
    ],
    'Freight Drivers': [
        'CDL A (Hazmat REQ) Tractor Trailer Truckload Driver Dedicated',
        'CDL A Tractor Trailer Truckload Driver Dedicated',
        'Flatbed Driver',
        'Freight (Air, Ocean and Ground)',
        'Freight Forwarding',
        'FT Freight PU and Delivery Driver',
        'Line Hail Sleeper Team Driver',
        'OTR CDL A Tractor Trailer Truckload Driver (Hazmat REQ)',
        'OTR CDL A Tractor Trailer Truckload Driver Dedicated',
        'OTR CDL A Tractor Trailer Truckload Driver',
        'OTR CDL A Tractor Trailer Truckload Driver (Hazmat REQ) Dedicated',
        'OTR Team CDL A Tractor Trailer Truckload Driver (Hazmat REQ)',
        'OTR Team Driver CDL A Tractor Trailer Truckload Dedicated',
        'Part time Road Driver',
        'PR Freight PU and Delivery Driver',
        'Team Driver CDL A Tractor Trailer Truckload Dedicated',
        'Tractor Trailer Driver',
        'Yard Shifter (Tractor Trailer)',
        'Part Time'
    ],
};
function aContainsB (a, b) {
    return a.indexOf(b) >= 0;
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

function search(nameKey, myArray){
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i].Search === nameKey) {
            return myArray[i];
        }
    }
    return {};
}

function shuffle(array) {
    var m = array.length, t, i;

    // While there remain elements to shuffle…
    while (m) {

        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);

        // And swap it with the current element.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }

    return array;
}

function objectLength(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
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
    $('#military-skills-translator').submit(function(e){
        e.preventDefault();
        //hide old search results
        $('#side--a').addClass('full-width');
        $('#form-error').addClass('hidden');
        $('#form-error').text('');
        $('#military-job').addClass('hidden');
        $('#job-types').addClass('hidden');
        //$('.component--expander').addClass('hidden');

        $('.wrap--match-bucket').addClass('hidden');
        $('.wrap--no-match-bucket').addClass('hidden');
        $('.wrap--all-buckets .component--expander').text('');
        $('.wrap--all-buckets').addClass('hidden');


        //searh value
        var searchString = $('#job-code').val();

        //search
        var result = search(searchString, allJobs);
        if (!$.isEmptyObject(result)) {
            //we have a result!
            //set the military job title
            $('#military-job-title').text(result.Title);

            //fill in bucket info
            var b = result.Bucket;
            if (b > 0) {
                var bucketTitle = buckets[b].name;

                var bucketDescription = buckets[b].description;

                $('.wrap--match-bucket .expander__parent').text(bucketTitle);
                $('.wrap--match-bucket .expander__parent+p').text(bucketDescription);

                //reveal direct match
                $('.wrap--match-bucket').removeClass('hidden');
                console.log('direct match with bucket  ' + bucketTitle);


                if (categories.hasOwnProperty(bucketTitle)) {

                    var cats = categories[bucketTitle];

                    for (j = 0; j < cats.length; j++) {

                        var categoryTitle = categories[bucketTitle][j];

                        console.log(categoryTitle);

                        var categoryURL = 'http://jobs-ups.com/search/advanced-search/ASCategory/' + encodeURIComponent(categoryTitle) + '/ASPostedDate/-1/ASCountry/-1/ASState/-1/ASCity/-1/ASLocation/-1/ASCompanyName/-1/ASCustom1/-1/ASCustom2/-1/ASCustom3/-1/ASCustom4/-1/ASCustom5/-1/ASIsRadius/false/ASCityStateZipcode/-1/ASDistance/-1/ASLatitude/-1/ASLongitude/-1/ASDistanceType/-1';

                        $('.hidden-part').attr('data-id','0').children('.expander__child').append('<div class="job-category"><h3 class="job-category_title">' + categoryTitle + '</h3><a href="' + categoryURL + '">Search</a></div>');

                        console.log('test');
                    }
                }

            } else {
                $('.wrap--no-match-bucket').removeClass('hidden');
                console.log('no direct match');
            }

            //generate other buckets
            var otherBuckets = [];

            for( i = 1; i < buckets.length; i++) {

                //exclude the matched bucket
                if (i != b) {
                    otherBuckets.push(buckets[i]);
                }
            }
            //randomize buckets
            var randBuckets = shuffle(otherBuckets);

            console.log(randBuckets);

            //loop through randomized bucket list
            for( i = 0; i < randBuckets.length; i++) {

                var randBucketTitle = randBuckets[i].name;

                console.log(randBucketTitle);

                var randBucketDescription = randBuckets[i].description;

                $('.wrap--all-buckets .component--expander').append('<section class="expander__wrapper"><a data-id="' + i + '" class="button expand-button"><h2 class="expander__parent">' + randBucketTitle + '</h2><i class="fa fa-plus fa-2x"></i></a><div data-id="' + i + '" class="hidden-part"><div class="expander__child"><p class="">' + randBucketDescription + '</p></div></div></section>');

                if (categories.hasOwnProperty(randBucketTitle)) {

                    var cats = categories[randBucketTitle];

                    for (j = 0; j < cats.length; j++) {

                        var categoryTitle = categories[randBucketTitle][j];

                        console.log(categoryTitle);

                        var categoryURL = 'http://jobs-ups.com/search/advanced-search/ASCategory/' + encodeURIComponent(categoryTitle) + '/ASPostedDate/-1/ASCountry/-1/ASState/-1/ASCity/-1/ASLocation/-1/ASCompanyName/-1/ASCustom1/-1/ASCustom2/-1/ASCustom3/-1/ASCustom4/-1/ASCustom5/-1/ASIsRadius/false/ASCityStateZipcode/-1/ASDistance/-1/ASLatitude/-1/ASLongitude/-1/ASDistanceType/-1';

                        $('.hidden-part[data-id="'+i+'"]').children('.expander__child').append('<div class="job-category"><h3 class="job-category_title">' + categoryTitle + '</h3><a href="' + categoryURL + '">Search</a></div>');

                        console.log('test');
                    }
                }

            }
            //reveal randomized bucket list
            $('.wrap--all-buckets').removeClass('hidden');


        } else {
            //no bucket match
        }

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