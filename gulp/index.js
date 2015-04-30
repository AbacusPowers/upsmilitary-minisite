module.exports = function( path ){
    'use strict';
    // gulp-help wraps gulp
    var gulp = require('gulp-help')(require('gulp')),
        colors = require('gulp-util').colors,
        log = require('gulp-util').log;
        // requireDirectory = require('require-directory');

    require('./build')( path );
    require('./develop')( path );
    require('./watch')( path );
    require('./css/analyze')( path );
    require('./css/autoprefix')( path );
    require('./css/bless')( path );
    require('./js/format')( path );
    require('./js/lint')( path );
    require('./js/style')( path );
    require('./js/validate')( path );
    require('./sass/compile')( path );
    require('./sass/lint')( path );
    //require('./svg/spriteify')( path );
    require('./svg/optimize')( path );
    // Require all JS files in gulp directory
    //requireDirectory(module, '.');

    log(
        '[' + colors.white.bgGreen.bold('IO|STUD|IO') + ']',
        colors.bgBlack.green('the iostudio multi-tool')
    );
    log(
        '[' + colors.white.bgGreen.bold('IO|STUD|IO') + ']',
        colors.bgBlack.green('iostudio, llc. Nashville, Tennessee')
    );

};
