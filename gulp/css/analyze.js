module.exports = function( path ){
    'use strict';
    var gulp = require('gulp'),
        stylestats = require('gulp-stylestats');

    gulp.task('analyze:css', false, function() {
            return gulp.src(path.css + '/**/*.css')
                .pipe(stylestats());
    });
};
