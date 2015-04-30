module.exports = function( path ){
    'use strict';
    var gulp = require('gulp'),
        debug = require('gulp-debug'),
        colors = require('gulp-util').colors,
        browserSync = require('browser-sync');

    var taskDescription = colors.green( colors.white.bgYellow.bold('Deployment task') ,'\n\t   Build all file types' , colors.black.bgYellow('JavaScript'),  colors.blue.bgCyan.inverse('CSS') );

    gulp.task('build', taskDescription, ['build:css', 'build:js']);

    gulp.task('build:js', false, ['validate:js', 'lint:js'], function() {
        return gulp.src(path.js + '/**/*.js')
            .pipe(browserSync.reload({
                stream: true,
                open: "external",
                once: true
            }));
    });

    gulp.task('build:css', false, ['compile:sass', 'autoprefix', 'bless']);

    gulp.task('build:sprite', false, ['optimize:sprite']);
};
