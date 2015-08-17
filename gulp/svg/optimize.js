module.exports = function( path ){
    'use strict';
    var gulp = require('gulp'),
        svgspritesheet = require('./gulp-svg-spritesheet'),
//        imagemin = require('gulp-imagemin'),
        inquirer = require('inquirer'),
        cheerio = require('gulp-cheerio');

    var prepareSVG = function ($, file, done){
            var svgFile = file.relative.slice(0,-4);
            $('svg').attr('id', svgFile).html();
            done();
        };



    var prepareSprite = function ($, file, done){

        $('svg')
            .removeAttr('width')
            .removeAttr('height')
            .removeAttr('x')
            .removeAttr('y')
            .removeAttr('enable-background')
            .attr('preserveAspectRatio', 'xMidYMid meet');

        $('svg svg').each( function(i, elem){
            elem.name = 'symbol';
        });


        $.html();

        done();
    };

    gulp.task('spriteify:svg', false, ['optimize:svg'], function (done) {
        gulp.src('src/chamber/DashboardBundle/Resources/svg/*.svg')
        .pipe(svgspritesheet({
            cssPathSvg: 'bundles/dashboard/svg/sprite.svg',
            padding: 2,
            pixelBase: 10,
            positioning: 'packed',
            templateSrc: 'node_modules/gulp-svg-spritesheet/template.tpl',
            templateDest: 'src/chamber/DashboardBundle/Resources/sass/ioStyle/_sprite.scss',
            units: 'em'
        }))
        .pipe( gulp.dest('src/chamber/DashboardBundle/Resources/public/svg/sprite.svg'))
        .on('finish', function(){ done(); });
    });

    gulp.task('optimize:svg',  false, function (done) {
        gulp.src('src/chamber/DashboardBundle/Resources/svg/*.svg')
        .pipe(cheerio({
            run: prepareSVG,
            parserOptions: {
              xmlMode: true
            }
        }))
        .pipe( gulp.dest('src/chamber/DashboardBundle/Resources/svg/'))
        .on('finish', function(){ done(); });
    });

//      gulp.task('optimize:sprite', false, ['spriteify:svg' ], function( done ) {
//          gulp.src( 'src/chamber/DashboardBundle/Resources/public/svg/sprite.svg' )
//              .pipe(cheerio({
//                  run: prepareSprite,
//                  parserOptions: {
//                    xmlMode: true
//                  }
//              }))
//              .pipe(imagemin({
//                  plugins: [
//                  // SVGOptimizer Plugin list
//                  // https://github.com/svg/svgo/tree/master/plugins
//                  {cleanupAttrs: true},
//                  {cleanupEnableBackground: true},
//                  {cleanupIDs: false},
//                  {cleanupListOfValues: false},
//                  {cleanupNumericValues: true},
//                  {collapseGroups: true},
//                  {convertColors: true},
//                  {convertPathData: false},
//                  {convertShapeToPath: true},
//                  {convertStyleToAttrs: true},
//                  {convertTransform: false},
//                  {mergePaths: true},
//                  {moveElemsAttrsToGroup: true},
//                  {moveGroupAttrsToElems: false},
//                  {removeComments: true},
//                  {removeDesc: false},
//                  {removeDoctype: true},
//                  {removeEditorsNSData: true},
//                  {removeEmptyAttrs: true},
//                  {removeEmptyContainers: true},
//                  {removeEmptyText: true},
//                  {removeHiddenElems: false},
//                  {removeMetadata: true},
//                  {removeNonInheritableGroupAttrs: true},
//                  {removeRasterImages: true},
//                  {removeTitle: false},
//                  {removeUnknownsAndDefaults: true},
//                  {removeUnusedNS: true},
//                  {removeUselessStrokeAndFill: true},
//                  {removeViewBox: false},
//                  {removeXMLProcInst: true},
//                  {sortAttr: true},
//                  {transformsWithOnePath: false}
//                  ]
//              }))
//              .pipe(gulp.dest( 'src/chamber/DashboardBundle/Resources/public/svg/' ))
//              .on('finish', function(){ done(); });
//          });
//  
};
