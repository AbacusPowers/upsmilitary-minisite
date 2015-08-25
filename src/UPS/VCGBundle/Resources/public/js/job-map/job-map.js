(function($) {

    /*
     * Some constants isolated for easy configuration.
     */
    var CONST = {
        BASE_DATA_URL: '/js/job-map/',
 
        FOCUS_DEFAULT: {animate: true, scale: 1, x: 0.5, y: 0.5},
 
        JOB_DESC: {
            'Package Handler': 'Package handlers load and unload packages into or out of UPS vehicles.',
            'Driver Helper (Oct-Dec)': 'Driver helpers deliver and pick up UPS packages during peak season.',
            'Package Delivery Driver': 'Package delivery drivers must have excellent customer contact and driving skills.',
            'Feeder Driver': 'Feeder drivers transport packages by tractor-trailer between our centers and hubs.',
            'Automotive Mechanic': 'Automotive mechanics ensure we’re able to meet and exceed all challenges, efficiently and effectively.',
            'Facilities Mechanic': 'Facilities maintenance mechanics help maintain our infrastructure and facilities.',
            'Sales Representative': 'Sales representatives help customers identify and meet their business needs with UPS services.',
            'Warehouse Associate': 'Warehouse associates participate in a range of daily operations, including loading and unloading.',
            'UPS Freight Over the Road Driver': 'Over-the-road drivers operate tractor-trailers to deliver freight to two or more locations.',
            'Part-time Operations Supervisor': 'Part-time operations supervisors provide direct supervision to seven to 10 part-time package handlers.',
            'Business Analyst': 'Business systems analysts serve as liaisons between the business community and UPS Information Services.',
            'General Management Staff': 'Employees in these positions work in areas such as Operations, Marketing, Human resources and more.',
            'Administrative Support Staff': 'Employees in these positions perform general business functions, like customer service and organizational tasks.',
            'Information Technology Staff': 'Employees in these positions work with advanced technology to support UPS operations.'
        },
 
        MARKER_STYLES: {
            large: { fill: 'rgba(111,190,68, 0.5)' },
            medium: { fill: 'rgba(255,255,255,0.8)' },
            small: {}
        },
 
        RX_JOB_RM: / (\(Oct-Dec\))/i,
 
        SIZE_CLASSES: [ 'large', 'medium', 'small' ],
    };
    
    
    /*
     * Basis for all state objects.
     */
    var BASE_STATE = {
        data_loaded:    false, // whether state location data has been loaded

        /*
         * Called when changing focus to some other state (or to none).
         */
        blur: function() {
            vmap.removeAllMarkers();
            vmap.setSelectedRegions(this.unsel);
            vmapContainer.removeClass(this.code);
            infoContainer.empty();
        },
 
        /*
         * Called when data has been loaded, to compile an array of vector map markers.
         */
        compile_markers: function(data) {
            var markers = [];
            for (cityName in data) {
                var cityLocations = data[cityName];
                for (var i = 0, len = cityLocations.length; i < len; ++i) {
                    var location = cityLocations[i];
                    markers.push({
                        latLng: [location.lat, location.lon],
                        style: CONST.MARKER_STYLES[CONST.SIZE_CLASSES[location.size]]
                    });
                }
            }
            this.markers = markers;
        },
 
        /*
         * Called when changing focus to this state.
         */
        focus: function() {
            this.load();
            focus = {animate: true, region: this.code};
            
            if (!zoomed) {
                containers.removeClass('full-width');
                refresher.addClass('shown');
                infoContainer.addClass('opacity');
                vmapContainer.addClass('zoom');
                zoomed = true;
            }
            vmap.setFocus(focus);
            vmapContainer.addClass(this.code);
            infoContainer.append(this.info).addClass('opacity');
            vmap.addMarkers(this.markers);
        },
 
        /*
         * Lazy-load location data and compile markers and info.
         */
        load: function() {
            if (this.data_loaded) return;
 
            $.ajax({
                async:      false,
                cache:      false,
                context:    this,
                dataType:   'json',
                url:        CONST.BASE_DATA_URL + this.abbr + '-data.json',
                
                success:    function(data) {
                    this.compile_markers(data);
                    this.info = compile_info(this, data);
                    this.data_loaded = true;
                }
            });
        }
    };
    
    /*
     * A pseudo-state object for use as a nil case.
     */
    var NONE_STATE = {
        code:       '',     // empty code string; potentially useful
 
        /*
         * Do nothing when blurring away from the none-state.
         */
        blur: function() {},
 
        /*
         * Focusing the none-state equates to resetting.
         */
        focus: function() {
            zoomed = false;
            focus = CONST.FOCUS_DEFAULT;
            vmap.setFocus(focus);
            vmapContainer.removeClass('zoom');
            refresher.removeClass('shown');
            infoContainer.removeClass('opacity');
            containers.addClass('full-width');
        }
    };
    

    /*
     * Common variables. Globals are evil, but sometimes inevitable.
     */
    var bside, containers;
    var expander_id = 0;
    var focus = CONST.FOCUS_DEFAULT;
    var focusedState = NONE_STATE;
    var infoContainer, infoTemplate, refresher;
    var states = {'': NONE_STATE};
    var stateSelect, vmap, vmapContainer;
    var zoomed = false;
    

    /*
     * Initializer.
     */
    $(function() {
        bside = $('#side--b');
        containers = $('#side--a, side--b');
        refresher = $('#job-map--refresh');
        
        init_map();
        init_map_controls();
        init_info();
        
        refresher.click(function() {
            focus_state(NONE_STATE);
            stateSelect.val('');
            ga('send', 'event', 'career_explorer', 'click', 'reset_button');
        });
    });
    
    
    /*
     * 
     */
    function compile_city_info(template, name, locations) {
        var result = template.clone();

        $('[data-id]'                   , result).attr('data-id', expander_id++);
        $('[data-info="city-name"]'     , result).text(name + ' Area');
        $('[data-info="city-count"]'    , result).text(locations.length);
        
        var locationsContainer  = $('[data-info="locations"]', result);
        var locationTemplate    = $(locationsContainer.children()[0]).detach();
        
        for (var i = 0, len = locations.length; i < len; ++i) {
            locationsContainer.append(compile_location_info(locationTemplate, locations[i]));
        }
        return result;
    }
    
    
    /*
     * 
     */
    function compile_info(state, data) {
        var cities = Object.keys(data);
        var result = infoTemplate.clone();
        
        $('[data-info="name"]', result).text(state.name);
        //$('[data-info="count"]', result).text(cities.length);
        
        var citiesContainer = $('[data-info="cities"]', result);
        var cityTemplate    = $(citiesContainer.children()[0]).detach();
        
        cities.sort();
        for (var i = 0, len = cities.length; i < len; ++i) {
            var cityName = cities[i];
            citiesContainer.append(compile_city_info(
                cityTemplate,
                cityName,
                data[cityName]
            ));
        }
        return result;
    }
    
    
    /*
     * 
     */
    function compile_location_info(template, location) {
        var result  = template.clone();
        var jobs    = location.jobs;
        
        var sizeIndicator = $(
            '<i class="fa fa-circle location-'
            + CONST.SIZE_CLASSES[location.size]
            + '"></i>'
        );
        
        $('[data-id]'               , result).attr('data-id', expander_id++);
        $('[data-info="loc-name"]'  , result).text(location.name).prepend(sizeIndicator);
        $('[data-info="loc-count"]' , result).text(jobs.length);
        
        var jobsContainer = $('[data-info="jobs"]', result);
        
        for (var i = 0, len = jobs.length; i < len; ++i) {
            var job     = jobs[i];
            var jobDesc = CONST.JOB_DESC[job] || '';
            var href    = location_href(job, location);
            
            jobsContainer.append($(
                '<div class="job-wrapper"><p><span>'
                + job
                + '</span>&nbsp;&nbsp;'
                + jobDesc
                + '</p><a class="search-button" target="_blank" href="'
                + href
                + '"><span>search</span></a></div>'
            ));
        }
        return result;
    }

    
    /*
     * 
     */
    function fetch_state(code) {
        var state = states[code];
        if (state == null) {
            state = new_state(code);
        }
        return state;
    }
    
    
    /*
     * 
     */
    function focus_state(state) {
        if (state !== focusedState) {
            focusedState.blur();
            state.focus();
            focusedState = state;
        }
    }

    
    /*
     * 
     */
    function init_info() {
        infoContainer = $('.map-info-container')
        infoTemplate = $('.map-info--state', infoContainer).detach();
    }
    
    
    /*
     * 
     */
    function init_map() {
        var mapContainer = $('#map-container');
        mapContainer.vectorMap({
            backgroundColor: 0,
            map: 'us_merc_en',
            markerStyle: {
                initial: {
                    opacity: 0.8,
                    
                    r: 8,
                    
                    'stroke-color': '#777',
                    'stroke-opacity': 0.1
                }
            },
            markersSelectable: false,
            onRegionSelected: on_region_selected,
            panOnDrag: false,
            regionsSelectable: true,
            regionsSelectableOne: true,
            regionStyle: {
                hover: {
                    fill: '#FFB500',
                    'fill-opacity': 1,
                    stroke: '#444444'
                },
                initial: {
                    fill: '#888888',
                    stroke: '#444444',
                    'stroke-width': 0
                },
                selected: {
                    fill: '#FFB500'
                }
            },
            zoomMax: 2.5,
            zoomOnScroll: false
        });
        vmap = mapContainer.vectorMap('get', 'mapObject');
        vmapContainer = $('.jvectormap-container');
    }


    /*
     * 
     */
    function init_map_controls() {
        stateSelect = $('#job-map--select-state');
        stateSelect.append($('<option value="">Select State</option>'));
        stateSelect.change(on_state_select_change);
        
        var regions = vmap.regions;
        var codes = Object.keys(regions);
        codes.sort();
        for (var i = 0, len = codes.length; i < len; ++i) {
            var c = codes[i];
            if (c == 'US-DC') continue;
            var option = $('<option></option>')
                .attr('value', c)
                .text(vmap.getRegionName(c))
            ;
            stateSelect.append(option);
        }
        
        $('.map-controls').removeClass('hidden');
    }
    
    
    /*
     * 
     */
    function location_href(job, location) {
        var href =
            'https://www.jobs-ups.com/search-jobs/'
            + encodeURI(job.replace(CONST.RX_JOB_RM, '') + '  ' + location.city + ', ' + location.state)
            + '/1187/1'
        ;
        return href;
    }

    
    /*
     * 
     */
    function new_state(code) {
        var state = $.extend(
            {
                abbr:   code.substr(3, 2),
                code:   code,
                name:   vmap.getRegionName(code),
                unsel:  {}
            },
            BASE_STATE
        );
        state.unsel[code] = false;
        states[code] = state;
        return state;
    }
    
    
    /*
     * 
     */
    function on_region_selected(event, code) {
        var state = fetch_state(code);
        focus_state(state);
        stateSelect.val(code);
        ga('send', 'event', 'career_explorer', 'click', state.name);
    }
    
    
    /*
     * 
     */
    function on_state_select_change() {
        var code = stateSelect.val();
        if (code == '') {
            focus_state(NONE_STATE);
        }
        else {
            vmap.setSelectedRegions(code);
            var state = fetch_state(code);
            ga('send', 'event', 'career_explorer', 'dropdown_select', state.name);
        }
    }
    
   
})(jQuery);
