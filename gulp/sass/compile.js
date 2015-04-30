module.exports = function( path ){
    'use strict';
    var gulp = require('gulp'),
        debug = require('gulp-debug'),
        plumber = require('gulp-plumber'),
        size = require('gulp-size'),
        duration = require('gulp-duration'),
        sass = require('gulp-ruby-sass'),
        colors = require('gulp-util').colors,
        log = require('gulp-util').log,
        filter = require('gulp-filter'),
        browserSync = require('browser-sync');

    var sassTxt = colors.white.bgMagenta.bold('SASS'),
        cssTxt = colors.white.bgCyan.bold('CSS');

    gulp.task('compile:sass', false, function() {

        // log(colors.white.bgMagenta.bold('SASS'), 'is compiling..');
        log(colors.white.bgMagenta.bold('SASS'), colors.bgYellow.magenta('Warning'), colors.green('Sass compilation may be slow due to Susy 2 grids triggering a performance bug in Sass') );
        log(colors.white.bgMagenta.bold('SASS'), colors.bgYellow.magenta('Warning'), colors.green('Github Issue: https://github.com/sass/sass/issues/1019#issuecomment-44870966') );
        //return path.sass.main
        return gulp.src(path.sass  + '/app.scss')
            .pipe(plumber())
            .pipe(size({
                title: sassTxt + colors.green.bold(' is compiling to ') + cssTxt,
                showFiles: true
            }))
            .pipe(sass({
                lineNumbers: true,
                style: 'expanded',
                trace: true,
                'sourcemap=none': true
            }))
            .pipe(size({
                showFiles: true
            }))
            .pipe(size({
                showFiles: true,
                gzip: true
            }))
            // Path is relative to current file
            .pipe(duration('compiling sass'))
            .pipe(gulp.dest(path.css ))
            .pipe(gulp.dest('web/bundles/dashboard/css'))
            .pipe(filter('**/*.css'))
            .pipe(browserSync.reload({
                stream: true
            }));
    });
};
