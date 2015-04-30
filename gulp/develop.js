module.exports = function( path ){
    'use strict';
    var gulp = require('gulp'),
        colors = require('gulp-util').colors,
        log = require('gulp-util').log,
        browserSync = require('browser-sync'),
        inquirer = require('inquirer');

    var taskDescription = colors.green(colors.white.bgGreen.bold('Developer task'), 'Initialize Browser Sync, watch files for changes, live inject CSS and live reload Javascript files');

    gulp.task('develop', taskDescription, ['watch'], function() {
        inquirer.prompt([{
                type: 'checkbox',
                name: 'Browser Suggestion',
                message: 'Which browser(s) would you like to develop in?',
                choices: [
                    {name: "google chrome", checked: true},
                    {name: "firefox"},
                    {name: "safari"},
                    {name: "opera"}
                ]
            }], function( answers ) {
                browserSync.init({
                    codeSync: true,
                    ghostMode: {
                        clicks: true,
                        location: true,
                        forms: true,
                        scroll: true
                    },
                    logPrefix: "Browser Sync",
                    proxy: path.url,
                    startPath: "/app_dev.php",
                    browser: answers['Browser Suggestion']
                });
        });
    });
};
