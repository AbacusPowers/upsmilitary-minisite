module.exports = function( path ){
    'use strict';
    var gulp = require('gulp'),
        bless = require('gulp-bless');

    gulp.task('bless', 'Split CSS for IE9 down', ['compile:sass', 'autoprefix'], function() {
        return gulp.src(path.css + '/app.css')
            .pipe(bless({
                cacheBuster: true,
                cleanup: true,
                compress: false,
                force: false,
                imports: true
            }))
            .pipe(gulp.dest(path.css + '/ie/'));
    });
};