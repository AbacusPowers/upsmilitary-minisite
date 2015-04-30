
require('./gulp')({
    css: 'src/UPS/VCGBundle/Resources/public/css',
    js: 'src/UPS/VCGBundle/Resources/public/js',
    sass: 'src/UPS/VCGBundle/Resources/sass',
    svg: 'src/UPS/VCGBundle/Resources',
    url: 'upssymfony.dev/app_dev.php'
});

// Allows gulp-devtools to display tasks in chrome inspector
// https://www.npmjs.com/package/gulp-devtools
// module.exports = gulp;
