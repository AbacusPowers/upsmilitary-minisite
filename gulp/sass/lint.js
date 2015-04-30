module.exports = function( path ){
    'use strict';
    var gulp = require('gulp'),
        scsslint = require('gulp-scss-lint');

    gulp.task('lint:sass', false, function() {
        return gulp.src(path.sass.all + '/**/*.scss')
            .pipe( scsslint({
                maxBuffer: 1000 * 1024
            }) );
    });
};
