(function($) {

    /*
     * Some constants isolated for easy reconfiguration.
     */
    var CONST = {
        COLOR_PATH:         '#996D00',
        COLOR_PATH_HILITE:  '#FFB500',
        COLOR_STROKE:       '#351C15',

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
         * Called when changing the focus to this state.
         */
        focus: function() {
            this.is_focus = true;
            this.set_hilite(true);
            this.load(); // do lazy-loading
        },

        
        /*
         * Prepare lazy-loaded aspects. Currently this means: bounding box, locations, and info html.
         */
        load: function() {
            if (this.loaded) { return; }
            
            this.box = this.path.getBBox();
            
            var abbr = this.abbr;
            for (var i = 0, len = $JOB_MAP_DATA.length; i < len; ++i) {
                var loc = $JOB_MAP_DATA[i];
                if (loc.state_abbr === abbr) {
                    this.locations.push(loc);
                }
            }
            
            this.info = info.load(this);
            
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
            var container = this.container = $('.map-info-section');
            var initial = this.initial = $('.map-info--initial', container).detach();
            var template = this.template = $('.map-info--state', container).detach();
            this.expander_id = 0;
            this.show_initial();
        },


        /*
         * Compile info html for the given state.
         */
        load: function(state) {
            var result = this.template.clone();
            $('[data-info="name"]', result).text(state.name);
            $('[data-info="count"]', result).text(state.locations.length);
            
            var locations = $('[data-info="locations"]', result);
            var locationTemplate = $(locations.children()[0]).detach();
            
            var list = state.locations;
            for (var i = 0, len = list.length; i < len; ++i) {
                var id = this.expander_id++;
                var elt = list[i];
                var item = locationTemplate.clone();
                locations.append(item);
                $('[data-id]', item).attr('data-id', id);
                $('[data-info="loc-name"]', item).text(elt.name);
                $('[data-info="loc-city"]', item).text(elt.city);
                var types = $('[data-info="loc-types"]', item);
                var typeList = elt.jobs.split(', ');
                for (var j = 0, jlen = typeList.length; j < jlen; ++j) {
                    types.append($('<p>' + typeList[j] + '</p>'));
                }
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
            
            var statesGroup = this.statesGroup = snap.select('g.svg-states-group');
            statesGroup.transform('0,0,0,0,0,0');

            var statePaths = this.statePaths = snap.selectAll('g.svg-states-group > path[title]');
            for (i = 0, len = statePaths.length; i < len; ++i) {
                this.add_state(statePaths[i]);
            }
        },


        /*
         * Create a state object for the given path and add it to the collection.
         */
        add_state: function(path) {
            var abbr = path.attr('id');
            var state = $.extend(
                {
                    abbr:       abbr,
                    locations:  [],
                    name:       path.attr('title'),
                    path:       path
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
            }
            
            if (state != null) {
                state.focus();
                this.focus = state;
                this.zoom();
                stateSelect.val(state.abbr);
                info.show(state.info);
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
     * Document ready initializer.
     */
    $(function() {
        map.init();
        info.init();
        init_state_select();
    });
    
    
    /*
     * Initialize the state select box, including generating option elements from the state list.
     */
    function init_state_select() {
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
