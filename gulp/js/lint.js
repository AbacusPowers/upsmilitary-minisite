module.exports = function( path ){
    'use strict';
    var gulp = require('gulp'),
        gutil = require('gulp-util'),
        notify = require('gulp-notify'),
        jsHint = require('gulp-jshint'),
        stylish = require('jshint-stylish');

    gulp.task('lint:js', false, function() {
        return gulp.src(path.js + '/**/*.js')
            .pipe(notify({
                title: 'JSHint',
                message: 'JavaScript is linting...',
                onLast: true
            }))
            .pipe(jsHint())
            .pipe(jsHint.reporter(stylish));
    });
};
