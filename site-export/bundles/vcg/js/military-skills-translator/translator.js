
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

var searchUrls = {};
searchUrls['Delivery Driver Jobs'] = 'https://www.jobs-ups.com/category/delivery-driver-jobs/1187/4674/1';
searchUrls['Driver Helper Jobs'] ='https://www.jobs-ups.com/category/driver-helper-jobs/1187/12132/1';
searchUrls['Driver Jobs'] ='https://www.jobs-ups.com/category/driver-jobs/1187/4624/1';
searchUrls['Driver Non-CDL Jobs'] ='https://www.jobs-ups.com/category/driver-non-cdl-jobs/1187/12116/1';
searchUrls['Truck Driver CDL Jobs'] ='https://www.jobs-ups.com/category/truck-driver-cdl-jobs/1187/12131/1';
searchUrls['Warehousing Jobs'] ='https://www.jobs-ups.com/category/warehousing-jobs/1187/4637/1';
searchUrls['Logistics Jobs'] ='https://www.jobs-ups.com/category/logistics-jobs/1187/4665/1';
searchUrls['Package Handling Jobs'] ='https://www.jobs-ups.com/category/package-handling-jobs/1187/4635/1';
searchUrls['Dock Worker Jobs'] ='https://www.jobs-ups.com/category/dock-worker-jobs/1187/4656/1';
searchUrls['Operations Jobs'] ='https://www.jobs-ups.com/category/operations-jobs/1187/4668/1';
searchUrls['Mechanic Jobs'] ='https://www.jobs-ups.com/category/mechanic-jobs/1187/4666/1';
searchUrls['Administrative Jobs'] ='https://www.jobs-ups.com/category/administrative-jobs/1187/4638/1';
searchUrls['Communication Jobs'] ='https://www.jobs-ups.com/category/communication-jobs/1187/11153/1';
searchUrls['Finance and Accounting Jobs'] ='https://www.jobs-ups.com/category/finance-and-accounting-jobs/1187/4652/1';
searchUrls['Human Resources Jobs'] ='https://www.jobs-ups.com/category/human-resources-jobs/1187/4626/1';
searchUrls['Legal Jobs'] ='https://www.jobs-ups.com/category/legal-jobs/1187/4663/1';
searchUrls['Internship Jobs'] ='https://www.jobs-ups.com/category/internship-jobs/1187/4662/1';
searchUrls['Marketing & Communication Jobs'] ='https://www.jobs-ups.com/category/marketing-and-communication-jobs/1187/12133/1';
searchUrls['Information Systems Jobs'] ='https://www.jobs-ups.com/category/information-systems-jobs/1187/4661/1';
searchUrls['Information Technology Jobs'] ='https://www.jobs-ups.com/category/information-technology-jobs/1187/12138/1';
searchUrls['Information Management & Security Jobs'] ='https://www.jobs-ups.com/category/information-management-and-security-jobs/1187/15057/1';
searchUrls['Applications Development Jobs'] ='https://www.jobs-ups.com/category/applications-development-jobs/1187/15047/1';
searchUrls['Infrastructure Jobs'] ='https://www.jobs-ups.com/category/infrastructure-jobs/1187/15058/1';
searchUrls['Aircraft Jobs'] ='https://www.jobs-ups.com/category/aircraft-jobs/1187/4639/1';
searchUrls['Industrial Engineering Jobs'] ='https://www.jobs-ups.com/category/industrial-engineering-jobs/1187/4633/1';
searchUrls['Customer Service Jobs'] ='https://www.jobs-ups.com/category/customer-service-jobs/1187/4632/1';
searchUrls['Inside Sales Jobs'] ='https://www.jobs-ups.com/category/inside-sales-jobs/1187/12134/1';
searchUrls['Sales Jobs'] ='https://www.jobs-ups.com/category/sales-jobs/1187/4628/1';
searchUrls['Business Management Jobs'] ='https://www.jobs-ups.com/category/business-management-jobs/1187/4642/1';
searchUrls['Part Time Jobs'] ='https://www.jobs-ups.com/category/part-time-jobs/1187/12137/1';
searchUrls['Part-Time Hourly and Seasonal Jobs'] ='https://www.jobs-ups.com/category/part-time-hourly-and-seasonal-jobs/1187/12085/1';
searchUrls['Seasonal Jobs'] ='https://www.jobs-ups.com/category/seasonal-jobs/1187/12811/1';


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

                        var categoryURL = searchUrls[categoryTitle];
                        //var categoryURL = 'http://jobs-ups.com/search/advanced-search/ASCategory/' + encodeURIComponent(categoryTitle) + '/ASPostedDate/-1/ASCountry/-1/ASState/-1/ASCity/-1/ASLocation/-1/ASCompanyName/-1/ASCustom1/-1/ASCustom2/-1/ASCustom3/-1/ASCustom4/-1/ASCustom5/-1/ASIsRadius/false/ASCityStateZipcode/-1/ASDistance/-1/ASLatitude/-1/ASLongitude/-1/ASDistanceType/-1';

                        $('.hidden-part').attr('data-id', '0').children('.expander__child').append('<div class="job-category"><h3 class="job-category_title">' + categoryTitle + '</h3><a class="search-button" target="_blank" href="' + categoryURL + '"><div>Current Openings</div></a></div>');

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

            //loop through randomized bucket list
            for (i = 0; i < randBuckets.length; i++) {

                var randBucketTitle = randBuckets[i].name;

                var randBucketDescription = randBuckets[i].description;

                $('.wrap--all-buckets .component--expander').append('<section class="expander__wrapper"><a data-id="' + i + '" class="button expand-button"><h2 class="expander__parent">' + randBucketTitle + '</h2><p class="">' + randBucketDescription + '</p><i class="fa fa-plus fa-2x"></i></a><div data-id="' + i + '" class="hidden-part"><div class="expander__child"></div></div></section>');

                if (categories.hasOwnProperty(randBucketTitle)) {

                    var cats = categories[randBucketTitle];

                    for (j = 0; j < cats.length; j++) {

                        var categoryTitle = categories[randBucketTitle][j];

                        var categoryURL = searchUrls[categoryTitle];
                        //var categoryURL = 'http://jobs-ups.com/search/advanced-search/ASCategory/' + encodeURIComponent(categoryTitle) + '/ASPostedDate/-1/ASCountry/-1/ASState/-1/ASCity/-1/ASLocation/-1/ASCompanyName/-1/ASCustom1/-1/ASCustom2/-1/ASCustom3/-1/ASCustom4/-1/ASCustom5/-1/ASIsRadius/false/ASCityStateZipcode/-1/ASDistance/-1/ASLatitude/-1/ASLongitude/-1/ASDistanceType/-1';

                        $('.wrap--all-buckets .hidden-part[data-id="' + i + '"]').children('.expander__child').append('<div class="job-category"><h3 class="job-category_title">' + categoryTitle + '</h3><a class="search-button" target="_blank" href="' + categoryURL + '"><div>Current Openings</div></a></div>');
                    }
                }

            }
            //reveal randomized bucket list
            $('.wrap--all-buckets').removeClass('hidden');

        }
    });
});