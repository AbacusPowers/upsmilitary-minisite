(function($) {

    /*
     * Some constants isolated for easy reconfiguration.
     */
    var CONST = {
        ATTR_PEG: [
            { fill: 'rgba(111,190,68, 0.5)' }, // Large
            { fill: 'rgba(255,255,255,0.8)' }, // Medium
            { fill: '#000000' }  // Small
        ],

        BASE_URL:           '/js/job-map/',
        
        COLOR_PATH:         '#888',
        COLOR_PATH_HILITE:  '#FFB500',
        COLOR_STROKE:       '#444',
 
        SIZE_CLASSES:       [ 'large', 'medium', 'small' ],
 
        STROKE_WIDTH:       '0.5',
        
        SUBMAPS: [
            /* continental */
            {
                top:    49.384471,      bottom: 24.543958,
                left:   -124.727821,    right:  -66.955528
            },
            
            /* alaska */
            {
                top:    71.337524,      bottom: 51.648282,
                left:   -177.977849,    right:  -130.016221
            },
            
            /* hawaii */
            {
                top:    22.228893,      bottom: 18.916201,
                left:   -160.243169,    right:  -154.813177
            }
        ]
    };
    
   
    CONST.ATTR_STATE        = { fill: CONST.COLOR_PATH };
    CONST.ATTR_STATE_HILITE = { fill: CONST.COLOR_PATH_HILITE };


    /*
     * Common aspects of all state objects.
     */
    var BASE_STATE = {
        is_focus:   false,  // whether this is the currently focused state
        loaded:     false,  // whether lazy-loading has been done for this state

 
        /*
         * Called when changing the focus to some other state (or to none).
         */
        blur: function() {
            this.is_focus = false;
            this.set_hilite(false);
        },


        /*
         * Called when changing the focus to this state.
         */
        focus: function() {
            this.is_focus = true;
            this.set_hilite(true);
            this.load();
        },

        
        /*
         * Prepare lazy-loaded aspects. Currently this means: bounding box, locations, and info html.
         */
        load: function() {
            if (this.loaded) { return; }
            
            $.ajax({
                async:      false,
                cache:      false,
                context:    this,
                dataType:   'json',
                url:        CONST.BASE_URL + this.abbr + '-data.json',
                
                success:    function(data) {
                    var cities = [];
                    this.cityData = data;
                    for (cityName in data) {
                        cities.push(cityName);
                    }
                    cities.sort(function(a, b) {
                        a = a.toUpperCase();
                        b = b.toUpperCase();
                        return (a < b) ? -1 : (a > b) ? 1 : 0;
                    });
                    this.cities = cities;
                }
            });
            
            this.box = this.path.getBBox();
            this.info = info.compile(this);
            this.pegs = map.compile_pegs(this);
            this.loaded = true;
        },

 
        /*
         * Sets the path attributes to either the basic state (on false) or the hilite state (on true).
         */
        set_hilite: function(flag) {
            this.path.attr(flag ? CONST.ATTR_STATE_HILITE : CONST.ATTR_STATE);
        }
    };


    /*
     * Info region state and utilities.
     */
    var info = {
        
        /*
         * Gather up the bits and bobs and get into the proper initial state.
         */
        init: function() {
            var container = this.container = $('.map-info-container');
            container.on('click', '.expand-button', on_expander_click_expand);
            container.on('click', '.hide-button', on_expander_click_hide);
            
            var template = this.template = $('.map-info--state', container).detach();
            
            this.expander_id = 0;
        },


        /*
         * Compile info html for the given state.
         */
        compile: function(state) {
            var result      = this.template.clone();
            var cities      = state.cities;
            var cityData    = state.cityData;
            
            $('[data-info="name"]', result).text(state.name);
            $('[data-info="count"]', result).text(cities.length);
            
            var citiesContainer = $('[data-info="cities"]', result);
            var cityTemplate    = $(citiesContainer.children()[0]).detach();
            for (var i = 0, ilen = cities.length; i < ilen; ++i) {
                var cityName = cities[i];
                citiesContainer.append(this.compile_city(
                    cityTemplate,
                    cityName,
                    cityData[cityName]
                ));
            }
            return result;
        },
        
        
        compile_city: function(template, name, locations) {
            var result = template.clone();
            
            $('[data-id]'                   , result).attr('data-id', this.expander_id++);
            $('[data-info="city-name"]'     , result).text(name + ' Area');
            $('[data-info="city-count"]'    , result).text(locations.length);
            
            var locationsContainer  = $('[data-info="locations"]', result);
            var locationTemplate    = $(locationsContainer.children()[0]).detach();
            var outerHidden         = locationsContainer.closest('.hidden-part');
            for (var i = 0, ilen = locations.length; i < ilen; ++i) {
                var loc = this.compile_location(locationTemplate, locations[i]);
                $('.hidden-part', loc).data('outer', outerHidden);
                locationsContainer.append(loc);
            }
            return result;
        },
        
        
        compile_location: function(template, location) {
            var result  = template.clone();
            var jobs    = location.jobs;
            
            var sizeIndicator = $(
                '<i class="fa fa-circle location-'
                + CONST.SIZE_CLASSES[location.size]
                + '"></i>'
            );
            
            $('[dataid]'                , result).attr('data-id', this.expander_id++);
            $('[data-info="loc-name"]'  , result).text(location.name).prepend(sizeIndicator);
            $('[data-info="loc-count"]' , result).text(jobs.length);
            
            var jobsContainer = $('[data-info="jobs"]', result);
            for (var i = 0, ilen = jobs.length; i < ilen; ++i) {
                var job = jobs[i];
                var href = 'http://jobs-ups.com/search/'
                    + encodeURI(job)
                    + '/ASCategory/-1/ASPostedDate/-1/ASCountry/-1/ASState/-1/ASCity/-1/ASLocation/-1/ASCompanyName/-1/ASCustom1/-1/ASCustom2/-1/ASCustom3/-1/ASCustom4/-1/ASCustom5/-1/ASIsRadius/true/ASCityStateZipcode/'
                    + location.zip
                    + '/ASDistance/50/ASLatitude/-1/ASLongitude/-1/ASDistanceType/-1'
                ;
                jobsContainer.append($('<p><a href="' + href + '">' + job + '</a></p>'));
            }
            return result;
        },


        /*
         * Switch to the info html for the given state.
         */
        show: function(elt) {
            this.container.empty();
            if (elt != null) {
                this.container.append(elt);
            }
        }
    };
    

    /*
     * The fancy SVG map.
     */
    var map = {
        focus:      null,           // currently focused state, if any
        stateData:  { '': null },   // map of state abbr's to their state objects
        states:     [],             // just an array of all state objects
 
 
        /*
         * Initialize the map: init Snap.svg, gather states.
         */
        init: function() {
            var snap = this.snap = Snap('.svg-map');
            snap.attr({
                fill:           CONST.COLOR_PATH,
                stroke:         CONST.COLOR_STROKE,
                'stroke-width': CONST.STROKE_WIDTH
            });
            
            this.box = snap.getBBox();

            var continental = {
                _:  'cont',
                x:  snap.select('#WA').getBBox().x,
                x2: snap.select('#ME').getBBox().x2,
                y:  snap.select('#MN').getBBox().y + 18,
                y2: snap.select('#FL').getBBox().y2 + 18
            };
            
            var tmpbb = snap.select('path[id="AK"]').getBBox();
            var alaska = {
                _:  'ak',
                x:  tmpbb.x,
                x2: tmpbb.x2,
                y:  tmpbb.y + 24,
                y2: tmpbb.y2 + 24
            };
            
            tmpbb = snap.select('path[id="HI"]').getBBox();
            var hawaii = {
                _:  'hi',
                x:  tmpbb.x,
                x2: tmpbb.x2,
                y:  tmpbb.y,
                y2: tmpbb.y2
            };
            
            this.submaps = [
                continental,
                alaska,
                hawaii
            ];
            for (i = 0, ilen = this.submaps.length; i < ilen; ++i) {
                var sm = this.submaps[i];
                var smc = CONST.SUBMAPS[i];
                sm.w = sm.x2 - sm.x;
                sm.h = sm.y2 - sm.y;
                sm.top = smc.top;
                sm.left = smc.left;
                sm.llh = smc.top - smc.bottom;
                sm.llw = smc.left - smc.right;
            }
            
            var statesGroup = this.statesGroup = snap.select('g.svg-states-group');
            statesGroup.transform('0,0,0,0,0,0');

            var statePaths = this.statePaths = snap.selectAll('g.svg-states-group > path[title]');
            for (i = 0, len = statePaths.length; i < len; ++i) {
                this.add_state(statePaths[i]);
            }
            
            var pegTemplate = this.pegTemplate = snap.select('g.svg-peg-template > g.svg-peg');
        },


        /*
         * Create a state object for the given path and add it to the collection.
         */
        add_state: function(path) {
            var abbr = path.attr('id');
            path.addClass('svg-state-path');

            var state = $.extend(
                {
                    abbr:   abbr,
                    name:   path.attr('title'),
                    path:   path
                },
                BASE_STATE
            );
            
            this.stateData[abbr] = state;
            this.states.push(state);
 
            path.data('state', state);
            path.mouseover(on_state_path_mouseover);
            path.mouseout(on_state_path_mouseout);
            path.click(on_state_path_click);
        },
 
 
        /*
         * 
         */
        compile_pegs: function(state) {
            var abbr        = state.abbr;
            var submapIndex = (abbr == 'AK') ? 1 : (abbr == 'HI') ? 2 : 0;
            var submap = this.submaps[submapIndex];
            
            var group = map.snap.g();
            group.addClass('svg-pegs-' + abbr);
            
            var pegBox = this.pegTemplate.getBBox();
            var pegMidX = pegBox.w / 2;
            var pegMidY = pegBox.h / 2;

            var cities = state.cities;
            for (var i = 0, ilen = cities.length; i < ilen; ++i) {
                var cityName    = cities[i];
                var locations   = state.cityData[cityName];
                
                for (var j = 0, jlen = locations.length; j < jlen; ++j) {
                    var location = locations[j];
                    
                    if (location.lat == null) { continue; }
                    
                    var peg = this.pegTemplate.clone();
                    
                    peg.attr('id', 'svg-peg--' + location.id);
                    peg.data('state', state);
                    peg.attr(CONST.ATTR_PEG[location.size]);
                    group.append(peg);
                    
                    var x = -((location.lon - submap.left) / submap.llw) * submap.w;
                    var y = -((location.lat - submap.top ) / submap.llh) * submap.h;
                    x += submap.x;
                    y += submap.y;
                    peg.transform("matrix(0.5,0,0,0.5," + x + "," + y + ")");
                    
                    peg.mouseover(on_state_path_mouseover);
                    peg.mouseout(on_state_path_mouseout);
                    peg.click(on_state_path_click);
                }
            }
            return group;
        },
 
 
        /*
         * Change focus to the given state (or to nothing if given null).
         */
        set_focus: function(state) {
            if (state === this.focus) { return; }

            var old = this.focus;
            if (old != null) {
                old.blur();
                this.focus = null;
                old.pegs.remove();
                this.zoom();
                stateSelect.val('');
                info.show(null);
                refresher.removeClass('shown');
            }
            
            if (state != null) {
                state.focus();
                this.focus = state;
                this.statesGroup.append(state.pegs);
                this.zoom();
                stateSelect.val(state.abbr);
                info.show(state.info);
                refresher.addClass('shown');
            }
        },
        
 
        /*
         * Perform the zoom animation to bring visual focus to the logical focus.
         */
        zoom: function() {
            var scale = 1, translateX = 0, translateY = 0;
            var state = this.focus;
            if (state != null) {
                var mapBox = this.box;
                var pathBox = state.box;
                scale = Math.min(
                    0.9 / Math.max(pathBox.width / mapBox.width, pathBox.height / mapBox.height),
                    3.98
                );
                translateX = mapBox.width / 2 - scale * pathBox.cx;
                translateY = mapBox.height / 2 - scale * pathBox.cy;
            }
            this.statesGroup.animate(
                { transform: 'matrix(' +
                    scale + ',0,0,' +
                    scale + ',' + translateX + ',' + translateY +
                ')' },
                300, mina.easein
            );
        }
    };
    
    
    /*
     * Common reference to the state select box. On mobile, this is our only interface.
     */
    var stateSelect;
    
    
    /*
     * Common reference to the refresher. Hidden on mobile.
     */
    var refresher;
    
    
    /*
     * Document ready initializer.
     */
    $(function() {
        map.init();
        info.init();
        init_map_controls();
        info.container.removeClass('hidden');
    });
    
    
    /*
     * Initialize the state select box, including generating option elements from the state list.
     */
    function init_map_controls() {
        stateSelect = $('#job-map--select-state');
        stateSelect.append($('<option val=""></option>'));
        
        stateSelect.change(function(event) {
            map.set_focus(map.stateData[stateSelect.val()]);
        });
        
        var list = map.states;
        list.sort(function(a, b) {
            a = a.name.toUpperCase();
            b = b.name.toUpperCase();
            return (a < b) ? -1 : (a > b) ? 1 : 0;
        });
        for (var i = 0, len = list.length; i < len; ++i) {
            var state = list[i];
            var option = $('<option></option>')
                .attr('value', state.abbr)
                .text(state.name)
            ;
            state.option = option;
            stateSelect.append(option);
        }
        
        refresher = $('#job-map--refresh');
        refresher.click(function() {
            map.set_focus(null);
        });
        
        $('.map-controls').removeClass('hidden');
    }
    
    
    /*
     * Event handler: show expandable.
     */
    function on_expander_click_expand() {
        var elt = $(this);
        elt.parent('.expander__wrapper').addClass('open-expander');
        
        var hidden = elt.siblings('.hidden-part');
        hidden.velocity("transition.slideDownBigIn");
        //var height = hidden.children('.expander__child').height();
        //var outer  = hidden.data('outer');
        //if (outer != null) {
        //    outer.velocity({ height: outer.height() + height }, 500);
        //}
        //hidden.velocity({ height: height, opacity: 1 }, 400);
        
        elt.hide();
        elt.siblings('.hide-button').show();
    }
    
    
    /*
     * Event handler: hide expandable.
     */
    function on_expander_click_hide() {
        var elt = $(this);
        elt.parent('.expander__wrapper').removeClass('open-expander');
        
        var hidden = elt.siblings('.hidden-part');
        hidden.velocity("transition.slideUpBigOut");
        //var outer  = hidden.data('outer');
        //if (outer != null) {
        //    var height = hidden.children('.expander__child').height();
        //    outer.velocity({ height: outer.height() - height }, 500);
        //}
        //hidden.velocity({ height: 0, opacity: 0}, 400);
        
        elt.hide();
        elt.siblings('.expand-button').show();
    }
    

    /*
     * Event handler.
     */
    function on_state_path_mouseout(event) {
        var state = this.data('state');
        if (! state.is_focus) { state.set_hilite(false); }
    }
    

    /*
     * Event handler.
     */
    function on_state_path_mouseover(event) {
        var state = this.data('state');
        if (! state.is_focus) { state.set_hilite(true); }
    }
    

    /*
     * Event handler.
     */
    function on_state_path_click(event) {
        var state = this.data('state');
        if (! state.is_focus) {
            map.set_focus(state);
        }
    }
    
    
})(jQuery);
