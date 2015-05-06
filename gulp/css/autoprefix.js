module.exports = function( path ){
    'use strict';
    var gulp = require('gulp'),
        prefix = require('gulp-autoprefixer');

    // List of options available here.
    // https://github.com/postcss/autoprefixer#browsers
     var AUTOPREFIXER_BROWSERS = [
        'last 10 version'
    ];

    gulp.task('autoprefix', 'Add CSS vendor prefix using caniuse.com', ['compile:sass'], function() {
        return gulp.src(path.css + '/app.css')
            .pipe( prefix({
                browsers: AUTOPREFIXER_BROWSERS,
                cascade: true
            }))
            .pipe(gulp.dest(path.css));
    });
};
