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
buckets[1] = {name: 'Drivers', description: 'Full- and part-time jobs moving packages between locations and delivering them to customers, including positions like Package Delivery Drivers, Driver Helpers, Tractor Trailer Drivers and Haz-Mat Endorsed Drivers'};
buckets[2] = {name: 'Logistics', description: 'Full- and part-time jobs ensuring packages are appropriately moved through UPS facilities, including positions like Package Handlers, Dockworkers and Warehouse Associates'};
buckets[3] = {name: 'Operations', description: 'Full- and part-time jobs ensuring UPS operations run smoothly for our customers, including positions like Part-time Supervisors and Support Specialists'};
buckets[4] = {name: 'Mechanics and Technicians', description: 'Full- and part-time jobs ensuring equipment in UPS facilities and vehicles is well maintained, including positions like Paint and Body Mechanics, Maintenance Mechanics and Trailer Shop Mechanics'};
buckets[5] = {name: 'Administrative Workers', description: 'Full- and part-time jobs ensuring UPS office duties are completed, including positions like Data Entry Personnel, Administrative Assistants and Dispatch Associates'};
buckets[6] = {name: 'Professional Workers', description: 'Full- and part-time jobs requiring advanced training or education in a specialized field, including positions like Accounting Associates, Advertising Managers, Legal Personnel, Human Resources Personnel and all Professional Internships'};
buckets[7] = {name: 'Information Systems', description: 'Full- and part-time jobs using technology to fulfill UPS\'s commitment to customers, including positions like Business Systems Analysts, Programming Analysts and Application Developers'};
buckets[8] = {name: 'Air Operations', description: 'Full- and part-time jobs within UPS\'s own airline, including positions like Pilots, First officers, and Aircraft Maintenance Mechanics'};
buckets[9] = {name: 'Engineers', description: 'Full- and part-time jobs improving UPS processes with technology and innovation, including positions like Aircraft Engineers, Industrial Engineering Specialists and Plant Engineers and Mechanics'};
buckets[10] = {name: 'Sales and Customer Service', description: 'Full- and part-time jobs ensuring the satisfaction of new and existing UPS customers, including positions like Customer Service Associates, Inside Sales Representatives and Account Executives'};
buckets[11] = {name: 'Part-Time, Hourly and Seasonal Workers', description: 'Part-time and seasonal opportunities at UPS are a great way to get started on a new career while going to school. Includes opportunities available in all UPS employment areas'};

var categories = {
    'Drivers': [
        'Delivery Driver Jobs',
        'Driver Helper Jobs',
        'Driver Jobs',
        'Driver Non-CDL Jobs',
        'Truck Driver CDL Jobs'
    ],
    'Logistics': [
        'Warehousing Jobs',
        'Logistics Jobs',
        'Package Handling Jobs',
        'Dock Worker Jobs'
    ],
    'Operations': [
        'Operations Jobs'
    ],
    'Mechanics and Technicians': [
        'Mechanic Jobs'
    ],
    'Administrative Workers': [
        'Administrative Jobs'
    ],
    'Professional Workers': [
        'Communication Jobs',
        'Finance and Accounting Jobs',
        'Human Resources Jobs',
        'Legal Jobs',
        'Internship Jobs',
        'Marketing & Communication Jobs'
    ],
    'Information Systems': [
        'Information Systems Jobs',
        'Information Technology Jobs',
        'Information Management & Security Jobs',
        'Applications Development Jobs',
        'Infrastructure Jobs'
    ],
    'Air Operations': [
        'Aircraft Jobs'
    ],
    'Engineers': [
        'Industrial Engineering Jobs'
    ],
    'Sales and Customer Service': [
        'Customer Service Jobs',
        'Inside Sales Jobs',
        'Sales Jobs',
        'Business Management Jobs'
    ],
    'Part-Time, Hourly and Seasonal Workers': [
        'Part Time Jobs',
        'Part-Time Hourly and Seasonal Jobs',
        'Seasonal Jobs'
    ]
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
    //console.log(hints);
    return hints;
}

function checkBranch(val){
    //console.log('changed');
    if(hints.indexOf( val ) < 0) {
        $('#form-error').text('Please choose from the list of suggestions.');
        $('#form-error').removeClass('hidden');
        $('input[type="submit"]').prop('disabled',false);
    } else {
        $('#form-error').addClass('hidden');
    }
    //console.log('value: ' + val + ' matches item ' + hints.indexOf(val));
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
    $.get("/bundles/vcg/data/new-jobs-data.csv", function (data) {
        //        console.log(data);
        allJobs = $.csv.toObjects(data);

    });

    $('#branch-of-service').change(function () {
        var val = $(this).val();
        $('#job-code').val('');
        $('#job-code').prop('disabled', false).removeClass('disabled-input');
        $('label[for="job-code"]').removeClass('disabled-input');

        hints = buildHints(val, allJobs);
        $('#job-code').autocomplete({
            source: hints,
            select: function (event, ui) {
                checkBranch(ui.item.value);
            }
        });
    });
    $('#job-code').on('input', function () {
        var val = $(this).val();
        checkBranch(val);
    });
    $('#branch-of-service').on('autocompletechange', function () {
        var val = $(this).val();
        checkBranch(val);
    });
    $('#military-skills-translator').submit(function (e) {
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
        $('.wrap--match-bucket .expander__child').text('');


        //searh value
        var searchString = $('#job-code').val();

        //search
        var result = search(searchString, allJobs);
        if (!$.isEmptyObject(result)) {
            //we have a result! (not an empty cell)
            //set the military job title
            $('#military-job-title').text(result.Title);
            //show the military job
            $('#military-job').removeClass('hidden');

            //fill in bucket info
            var b = result.Bucket;
            if (b > 0) {
                var bucketTitle = buckets[b].name;

                var bucketDescription = buckets[b].description;

                $('.wrap--match-bucket .expander__parent').text(bucketTitle);
                $('.wrap--match-bucket .expander__parent+p').text(bucketDescription);

                //reveal direct match
                $('.wrap--match-bucket').removeClass('hidden');
                //console.log('direct match with bucket  ' + bucketTitle);


                if (categories.hasOwnProperty(bucketTitle)) {

                    var cats = categories[bucketTitle];
                    //console.log('Bucket Categories: ' + cats);

                    for (j = 0; j < cats.length; j++) {

                        var categoryTitle = categories[bucketTitle][j];

                        //console.log(categoryTitle);

                        var categoryURL = 'http://jobs-ups.com/search/advanced-search/ASCategory/' + encodeURIComponent(categoryTitle) + '/ASPostedDate/-1/ASCountry/-1/ASState/-1/ASCity/-1/ASLocation/-1/ASCompanyName/-1/ASCustom1/-1/ASCustom2/-1/ASCustom3/-1/ASCustom4/-1/ASCustom5/-1/ASIsRadius/false/ASCityStateZipcode/-1/ASDistance/-1/ASLatitude/-1/ASLongitude/-1/ASDistanceType/-1';

                        $('.hidden-part').attr('data-id', '0').children('.expander__child').append('<div class="job-category"><h3 class="job-category_title">' + categoryTitle + '</h3><a class="search-button" target="_blank" href="' + categoryURL + '"><div>Search</div></a></div>');

                    }
                }

            } else {
                $('.wrap--no-match-bucket').removeClass('hidden');
                $('.wrap--all-buckets .bucket-wrap-label').addClass('hidden');
                //console.log('no direct match');
            }

            //generate other buckets
            var otherBuckets = [];

            for (i = 1; i < buckets.length; i++) {

                //exclude the matched bucket
                if (i != b) {
                    otherBuckets.push(buckets[i]);
                }
            }
            //randomize buckets
            var randBuckets = shuffle(otherBuckets);

            //console.log(randBuckets);

            //loop through randomized bucket list
            for (i = 0; i < randBuckets.length; i++) {

                var randBucketTitle = randBuckets[i].name;

                //console.log(randBucketTitle);

                var randBucketDescription = randBuckets[i].description;

                $('.wrap--all-buckets .component--expander').append('<section class="expander__wrapper"><a data-id="' + i + '" class="button expand-button"><h2 class="expander__parent">' + randBucketTitle + '</h2><p class="">' + randBucketDescription + '</p><i class="fa fa-plus fa-2x"></i></a><div data-id="' + i + '" class="hidden-part"><div class="expander__child"></div></div></section>');

                if (categories.hasOwnProperty(randBucketTitle)) {

                    var cats = categories[randBucketTitle];

                    for (j = 0; j < cats.length; j++) {

                        var categoryTitle = categories[randBucketTitle][j];

                        //console.log(categoryTitle);

                        var categoryURL = 'http://jobs-ups.com/search/advanced-search/ASCategory/' + encodeURIComponent(categoryTitle) + '/ASPostedDate/-1/ASCountry/-1/ASState/-1/ASCity/-1/ASLocation/-1/ASCompanyName/-1/ASCustom1/-1/ASCustom2/-1/ASCustom3/-1/ASCustom4/-1/ASCustom5/-1/ASIsRadius/false/ASCityStateZipcode/-1/ASDistance/-1/ASLatitude/-1/ASLongitude/-1/ASDistanceType/-1';

                        $('.wrap--all-buckets .hidden-part[data-id="' + i + '"]').children('.expander__child').append('<div class="job-category"><h3 class="job-category_title">' + categoryTitle + '</h3><a class="search-button" target="_blank" href="' + categoryURL + '"><div>Search</div></a></div>');

                        //console.log('test');
                    }
                }

            }
            //reveal randomized bucket list
            $('.wrap--all-buckets').removeClass('hidden');

        }
    });
});
//
//$(document)
//  .ajaxStart(function () {
//    $('#ajax-spinner').removeClass('hidden');
//  })
//  .ajaxStop(function () {
//    $('#ajax-spinner').addClass('hidden');
//  });