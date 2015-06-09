(function($) {

    /*
     * Some constants isolated for easy reconfiguration.
     */
    var CONST = {
        COLOR_PATH:         '#996D00',
        COLOR_PATH_HILITE:  '#FFB500',
        COLOR_STROKE:       '#351C15',
 
        RX_CAPITALIZE:      /(?:^|\s)[(]?\S/g,

        STROKE_WIDTH:       '0.5'
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
         * 
         */
        fetch_city: function(name) {
            var result = this.cities[name];
            if (result == null) {
                result = {
                    locations: [],
                    name: name
                };
                this.cities[name] = result;
                this.cityList.push(result);
            }
            return result;
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
            
            this.box = this.path.getBBox();
            
            var abbr = this.abbr;
            this.cities = {};
            this.cityList = [];
            for (var i = 0, ilen = $JOB_MAP_DATA.length; i < ilen; ++i) {
                var location = $JOB_MAP_DATA[i];
                if (location.state_abbr === abbr) {
                    this.fetch_city(location.city).locations.push(location);
                }
            }
            this.cityList.sort(function(a, b) {
                a = a.name.toUpperCase();
                b = b.name.toUpperCase();
                return (a < b) ? -1 : (a > b) ? 1 : 0;
            });
            
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
            template.removeClass('hidden');
            
            this.initial = $('.map-info--initial', container).detach();
            this.expander_id = 0;
            this.show_initial();
        },


        /*
         * Compile info html for the given state.
         */
        compile: function(state) {
            var result = this.template.clone();
            var cities = state.cityList;

            $('[data-info="name"]', result).text(state.name);
            $('[data-info="count"]', result).text(cities.length);
            
            var citiesContainer = $('[data-info="cities"]', result);
            var cityTemplate    = $(citiesContainer.children()[0]).detach();
            for (var i = 0, ilen = cities.length; i < ilen; ++i) {
                var city        = cities[i];
                var cityResult  = cityTemplate.clone();
                var locations   = city.locations;
                
                $('[data-id]'               , cityResult).attr('data-id', this.expander_id++);
                $('[data-info="city-name"]' , cityResult).text(capitalize(city.name) + " Area");
                $('[data-info="city-count"]', cityResult).text(locations.length);
                
                var locationsContainer  = $('[data-info="locations"]', cityResult);
                var locationTemplate    = $(locationsContainer.children()[0]).detach();
                var outerHidden         = locationsContainer.closest('.hidden-part');
                for (var j = 0, jlen = locations.length; j < jlen; ++j) {
                    var location        = locations[j];
                    var locationResult  = locationTemplate.clone();
                    var jobs            = location.jobs.split(', ');
                    
                    $('[data-id]'               , locationResult).attr('data-id', this.expander_id++);
                    $('[data-info="loc-name"]'  , locationResult).text(capitalize(location.name));
                    $('[data-info="loc-count"]' , locationResult).text(jobs.length);
                    
                    var jobsContainer = $('[data-info="jobs"]', locationResult);
                    for (var k = 0, klen = jobs.length; k < klen; ++k) {
                        jobsContainer.append($('<p>' + jobs[k] + '</p>'));
                    }
                    
                    $('.hidden-part', locationResult).data('outer', outerHidden);
                    
                    locationsContainer.append(locationResult);
                }
                
                citiesContainer.append(cityResult);
            }
            return result;
        },


        /*
         * Revert to the initial html.
         */
        show_initial: function() {
            this.container.empty();
            this.container.append(this.initial);
        },
 
 
        /*
         * Switch to the info html for the given state.
         */
        show: function(elt) {
            this.container.empty();
            this.container.append(elt);
        }
    };
    

    /*
     * The fancy SVG map.
     */
    var map = {
        focus:      null,           // currently focused state, if any
        states:     { '': null },   // map of state abbr's to their state objects
        stateList:  [],             // just an array of all state objects
 
 
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
            
            this.submapBoxes = [
                this.box,
                snap.select('path[id="AK"]').getBBox(),
                snap.select('path[id="HI"]').getBBox()
            ];
            
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
                    cities: [],
                    name:   path.attr('title'),
                    path:   path
                },
                BASE_STATE
            );
            
            this.states[abbr] = state;
            this.stateList.push(state);
 
            path.data('state', state);
            path.mouseover(on_state_path_mouseover);
            path.mouseout(on_state_path_mouseout);
            path.click(on_state_path_click);
        },
 
 
        /*
         * 
         */
        compile_pegs: function(state) {
            var abbr = state.abbr;
            var submap = (abbr == 'AK') ? 1 : (abbr == 'HI') ? 2 : 0;
            
            var group = map.snap.g();
            group.addClass('svg-pegs-' + abbr);
            
            var cities = state.cityList;
            for (var i = 0, ilen = cities.length; i < ilen; ++i) {
                var locations = cities[i].locations;
                for (var j = 0, jlen = locations.length; j < jlen; ++j) {
                    var location = locations[j];
                    if (location.lat == null) { continue; }

                    var coords = ll_to_xy(submap, location.lat, location.lon);
                    var peg = this.pegTemplate.clone();
                    peg.attr('id', 'svg-peg--' + location._LOC_NR);
                    peg.data('state', state);
                    group.append(peg);
                    if (location.size == "Medium") {
                        peg.attr({ fill: '#0000d8' });
                        peg.transform("matrix(0.4,0,0,0.4," + coords.x + "," + coords.y + ")");
                    }
                    else {
                        peg.attr({ fill: '#d80000' });
                        peg.transform("matrix(0.5,0,0,0.5," + coords.x + "," + coords.y + ")");
                    }

                    peg.mouseover(on_state_path_mouseover);
                    peg.mouseout(on_state_path_mouseout);
                    peg.click(on_state_path_click);
                }
            }
            this.statesGroup.append(group);
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
                this.zoom();
                stateSelect.val('');
                info.show_initial();
                refresher.removeClass('shown');
            }
            
            if (state != null) {
                state.focus();
                this.focus = state;
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

//         var states = map.stateList;
//         for(var i = 0, ilen = states.length; i < ilen; ++i) {
//             states[i].load();
//         }
    });
    
    
    /*
     * 
     */
    function capitalize(str) {
        return str.toLowerCase().replace(CONST.RX_CAPITALIZE, function(a) { return a.toUpperCase() });
    }
    
    
    /*
     * Initialize the state select box, including generating option elements from the state list.
     */
    function init_map_controls() {
        stateSelect = $('#job-map--select-state');
        stateSelect.append($('<option val=""></option>'));
        
        stateSelect.change(function(event) {
            map.set_focus(map.states[stateSelect.val()]);
        });
        
        var list = map.stateList;
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
    }
    
    
    /*
     * 
     */
    function ll_to_xy(submapIndex, lat, lon) {
        var submap = $JOB_MAP_SUBMAPS[submapIndex];
        var box = map.submapBoxes[submapIndex];
        return {
            x: (((submap.left - lon) / submap.w) * box.w) + box.x,
            y: (((submap.top  - lat) / submap.h) * box.h) + box.y
        };
    }
    
    
    /*
     * Event handler: show expandable.
     */
    function on_expander_click_expand() {
        var elt = $(this);
        elt.parent('.expander__wrapper').addClass('open-expander');
        
        var hidden = elt.siblings('.hidden-part');
        var height = hidden.children('.expander__child').height();
        var outer  = hidden.data('outer');
        if (outer != null) {
            outer.velocity({ height: outer.height() + height }, 500);
        }
        hidden.velocity({ height: height, opacity: 1 }, 400);
        
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
        var outer  = hidden.data('outer');
        if (outer != null) {
            var height = hidden.children('.expander__child').height();
            outer.velocity({ height: outer.height() - height }, 500);
        }
        hidden.velocity({ height: 0, opacity: 0}, 400);
        
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
        map.set_focus(state.is_focus ? null : state);
    }
    
})(jQuery);
