module.exports = function( path ){
    'use strict';
    var gulp = require('gulp'),
        fixmyjs = require('gulp-fixmyjs');

    gulp.task('fix:js', false, function() {
        return gulp.src(path.js + '/**/*.js')
            .pipe(fixmyjs())
            .pipe(gulp.dest('src/etk/AppBundle/Resources/js/'));
    });
};
