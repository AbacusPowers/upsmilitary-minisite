(function($) {
    var COL_DARK_FILL   = '#996d00';
    var COL_LITE_FILL   = '#ffb500';
    var COL_STROKE      = '#351c15';
    
    var ATTR_ACTIVE = {
        fill: COL_LITE_FILL
    };
    var ATTR_GLOBAL = {
        fill:           COL_DARK_FILL,
        stroke:         COL_STROKE,
        'stroke-width': '0.5'
    };
    var ATTR_INACTIVE = {
        fill: COL_DARK_FILL
    };
    
    
    var activeState, data, group, infoSection, infoStash, map, mapHeight, mapWidth, states, stateSelectCtrl;
    
    
    $(function() {
        var mapElt = $('.svg-map');
        if (mapElt.data('inited') === true) {
            return;
        }
        mapElt.data('inited', true);
        
        data = {};
        init_svg_map('.svg-map');
        build_state_select();
        init_info_section('.map-info-section');
    });
    
    
    function build_state_select() {
        stateSelectCtrl = $('.select-state');
        stateSelectCtrl.append($('<option value=""></option>'));
        stateSelectCtrl.change(function(event) {
            select_state(data.abbrMap[stateSelectCtrl.val()]);
        });

        var list = $(states).toArray().sort(sort_states);
        for (var i = 0, _len = states.length; i < _len; ++i) {
            var state = states[i];
            var option = $('<option></option>')
                .attr('value', state.attr('id'))
                .text(state.attr('title'))
            ;
            state.data('select-option', option);
            stateSelectCtrl.append(option);
        }
    }
    
    
    function deselect_state() {
        if (activeState != null) {
            activeState.attr(ATTR_INACTIVE);
            activeState = null;
            show_initial_info();
        }
    }
    
    
    function init_info_section(selector) {
        infoSection = $(selector);
        var stateInfo = $('.map-info--state', infoSection).detach();
        infoStash = {
            initial: $('.map-info--initial', infoSection).detach(),
            state: {
                div: stateInfo,
                title: $('.page--title', stateInfo),
                count: $('.map-info--state--count', stateInfo)
            },
            locations: []
        };
        show_initial_info();
    }


    function init_svg_map(selector) {
        map = Snap(selector);
        map.attr(ATTR_GLOBAL);
        
        var bbox = map.getBBox();
        mapHeight = bbox.height;
        mapWidth = bbox.width;
        
        group = map.select('g');
        group.transform('0,0,0,0,0,0');
        
        states = map.selectAll('g > path[title]');
        data.abbrMap = {'': null};
        states.forEach(init_svg_state);
    }
    
    
    function init_svg_state(state) {
        var abbr = state.attr('id');
        var stateData = {
            abbr: abbr,
            listings: [],
            state: state
        };
        data.abbrMap[abbr] = stateData;
        $JOB_MAP_DATA.forEach(function(elt) {
            if (elt.state_abbr === abbr) {
                stateData.listings.push(elt);
            }
        });
        
        state.mouseover(function(event) {
            this.attr(ATTR_ACTIVE);
        });
        
        state.mouseout(function(event) {
            if (this != activeState) {
                this.attr(ATTR_INACTIVE);
            }
        });
        
        state.click(function(event) {
            if (this != activeState) {
                var option = this.data('select-option');
                var abbr = option.attr('value');
                stateSelectCtrl.val(abbr);
                select_state(data.abbrMap[abbr]);
            }
            else {
                stateSelectCtrl.val('');
                select_state(null);
            }
        });
    }

    
    function select_state(stateData) {
        if (stateData == null) {
            deselect_state();
            zoom_map();
        }
        else if (stateData.state !== activeState) {
            deselect_state();
            if (stateData != null) {
                stateData.state.attr(ATTR_ACTIVE);
                activeState = stateData.state;
                show_state_info(stateData);
            }
            zoom_map();
        }
    }
    
    
    function show_info(info) {
        $('> div', infoSection).detach();
        infoSection.append(info);
    }
    
    
    function show_initial_info() {
        show_info(infoStash.initial);
    }
    
    
    function show_state_info(stateData) {
        var info = infoStash.state;
        info.title.text("Jobs in " + stateData.state.attr('title'));
        info.count.text(stateData.listings.length);
        show_info(info.div);
    }
    
    
    function sort_states(a, b) {
        a = a.attr('title').toUpperCase();
        b = b.attr('title').toUpperCase();
        return (a < b) ? -1 : (a > b) ? 1 : 0;
    }
    
    
    function zoom_map() {
        var scale = 1;
        var translateX = 0;
        var translateY = 0;
        if (activeState != null) {
            var bounds = activeState.getBBox();
            scale = Math.min(0.9 / Math.max(bounds.width / mapWidth, bounds.height / mapHeight), 3.98);
            translateX = mapWidth / 2 - scale * bounds.cx;
            translateY = mapHeight / 2 - scale * bounds.cy;
        }
        else {
        }
        group.animate(
            {transform: 'matrix(' + scale + ',0,0,' + scale + ',' + translateX + ',' + translateY + ')'},
            300, mina.easein
        );
    }

})(jQuery);
