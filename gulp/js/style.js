module.exports = function( path ){
    'use strict';
    var gulp = require('gulp'),
        jscs = require('gulp-jscs');

        gulp.task('style:js', false, function() {
            return gulp.src(path.js + '/**/*.js')
                .pipe(jscs());
    });
};
