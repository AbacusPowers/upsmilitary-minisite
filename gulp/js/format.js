module.exports = function( path ){
    'use strict';
    var gulp = require('gulp'),
        esFormatter = require('gulp-esformatter');

    gulp.task('format:js', false, function() {
        return gulp.src('gulpfile.js')
            .pipe(esFormatter({
                indent: {
                    // 1 Tab
                    value: '    '
                }
            }))
            .pipe(gulp.dest('.'));
    });
};
