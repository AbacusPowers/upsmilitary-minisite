module.exports = function( path ){
    'use strict';
    var gulp = require('gulp'),
        colors = require('gulp-util').colors,
        log = require('gulp-util').log;
        // path = require('./path');

    var taskDescription = colors.green('Watch all file types:',
                                    colors.black.bgYellow('JavaScript'), '(:js)' ,
                                    colors.white.bgMagenta.bold('SASS'), '(:sass)',
                                    colors.blue.bgCyan.inverse('CSS'), '(:css)' );

    gulp.task('watch', taskDescription , ['watch:js', 'watch:sass']);

    gulp.task('watch:sass', false, function() {
        gulp.watch(path.sass + '/**/*.scss', ['build:css']);
    });

    gulp.task('watch:js' , false, function() {
        gulp.watch(path.js + '/**/*.js', ['build:js']);
    });

    // gulp.task('watch:html', false, function() {
    //     gulp.watch(path.css  + '/**/*.html.twig', ['build:css']);
    // });
};
