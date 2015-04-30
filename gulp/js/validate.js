module.exports = function( path ){
    'use strict';
    var gulp = require('gulp'),
        colors = require('gulp-util').colors,
        jsValidate = require('gulp-jsvalidate'),
        size = require('gulp-size');

    var taskTitle = colors.green( colors.black.bgYellow('JavaScript'), colors.bold('is validating..') );

    gulp.task('validate:js', false, function() {
        return gulp.src(path.js + '/**/*.js')
            .pipe(size({
                title: taskTitle
            }))
            .pipe(jsValidate());
    });
};
