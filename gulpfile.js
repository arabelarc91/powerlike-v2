/*global require*/
"use strict";

// Config Tasks
var config = require("./config.json");

// Define required libraries
var gulp = require('gulp-help')(require('gulp'), {hideDepsMessage: true}),
    browserSync = require('browser-sync').create(),
    pug = require('gulp-pug'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    jslint = require('gulp-jslint'),
    sassLint = require('gulp-sass-lint'),
    imagemin = require('gulp-imagemin'),
    gulpif = require('gulp-if'),
    runSequence = require('run-sequence'),
    phantomcss = require('gulp-phantomcss'),
    path = require('path'),
    del = require('del'),
    plumber = require('gulp-plumber'),
    notify = require('gulp-notify'),
    util = require('gulp-util'),
    minify = require('gulp-minify'),
    critical = require('critical').stream,
    data = require('gulp-data'),
    log = require('fancy-log');

    //
gulp.task('critical', function() {
    return gulp
        .src(['build/views/product/personas.html'])
        .pipe(critical({
            base: 'dist/',
            inline: true,
            css: ['build/css/views/product/product.css']
        }))
        .on('error', function(err) {
            log.error(err.message);
        })
        .pipe(gulp.dest('dist'));
});

// Plumber Error
var onError = function (err) {
    // gutil.beep();
    notify.onError({
            title: "Error gulp en " + err.plugin,
            message: err.toString()
    })(err);
};

// Phantom CSS
gulp.task('phantomcss', false, function () {
    return gulp.src('./visualtest.js')
        .pipe(phantomcss({screenshots: 'tests', viewportSize: [1200, 2201]}));
});


// HTML Path
var excludeHTML = path.normalize('!**/{' + config.tasks.html.excludeFolders.join(',') + '}/**'),
    htmlpath = {
        src: [path.join( config.paths.source, config.tasks.html.src, '/**/*.{'+ config.tasks.html.extensions +'}'), excludeHTML],
        dest: path.join( config.paths.build, config.tasks.html.dest ),
        release: path.join( config.paths.release, config.tasks.html.dest)
    };

// HTML Task
gulp.task('html', false, function () {
    return gulp.src(htmlpath.src)
        .pipe(plumber({ errorHandler: onError}))
        .pipe( data(function() {
            if (util.env.path) {
                // console.log( util.env.path );
                return { 'path': util.env.path }
            }
        }))
        .pipe(pug(config.tasks.html.options))
        .pipe( gulp.dest( global.release ? htmlpath.release : htmlpath.dest ) )
        .on('end', browserSync.reload);
});

// CSS Path
var csspath = {
    src: path.join( config.paths.source, config.tasks.css.src, '/**/*.{' + config.tasks.css.extensions  + '}' ),
    dest: path.join( config.paths.build, config.tasks.css.dest ),
    release: path.join( config.paths.release, config.tasks.css.dest )
};

// CSS Task
gulp.task('sass', false, function () {
  return gulp.src( csspath.src )
    .pipe(plumber({ errorHandler: onError}))
    .pipe(gulpif(!global.release, sourcemaps.init()))
    .pipe(sass(config.tasks.css.sass))
    .pipe(autoprefixer(config.tasks.css.autoprefixer))
    .pipe(gulpif(global.release, cssnano( config.tasks.css.nano )))
    .pipe(gulpif(!global.release, sourcemaps.write('.')))
    .pipe(gulp.dest( global.release ?  csspath.release : csspath.dest ) )
    .pipe(browserSync.stream());
});

// SASS LINT
gulp.task('sasslint', false, function () {
    return gulp.src( csspath.src )
        .pipe(sassLint())
        .pipe(sassLint.format())
        .pipe(sassLint.failOnError());
});

// JS Path
var jsVendor = path.join( config.paths.source, config.tasks.js.src, '/vendor/*.'+ config.tasks.js.extensions ),
    jspath = {
        src: [jsVendor, path.join( config.paths.source, config.tasks.js.src, '/*.'+ config.tasks.js.extensions )],
        dest: path.join( config.paths.build, config.tasks.js.dest ),
        release: path.join( config.paths.release, config.tasks.js.dest ),
    };

// JS Task
gulp.task('js', false, function () {
    return gulp.src( jspath.src )
        //.pipe( concat('main.js') )
        .pipe(minify())
        //.pipe( gulpif( global.release, uglify()))
        .pipe( gulp.dest(global.release ? jspath.release : jspath.dest) )
        .pipe( browserSync.stream()) ;
});

// JS LINT
gulp.task('jslint', false, function () {
    return gulp.src( jspath.src[1] )
        .pipe(jslint({
            browser: true,
            global: ['$']
        }))
        .pipe(jslint.reporter('stylish'));
});

// Images Path
var imagespath = {
    src: path.join( config.paths.source, config.tasks.images.src, '/**/*.{' + config.tasks.images.extensions + '}' ),
    dest: path.join( config.paths.build, config.tasks.images.dest ),
    release: path.join( config.paths.release, config.tasks.images.dest )
};

// Images Task
gulp.task('images', false, function () {
    return gulp.src(imagespath.src)
        .pipe( gulpif( global.release, imagemin() ) )
        .pipe( gulp.dest( global.release ? imagespath.release : imagespath.dest )  );
});

// Fonts Path
var fontspath = {
    src: path.join(config.paths.source, config.tasks.fonts.src, '/**/*.{' + config.tasks.fonts.extensions + '}'),
    dest: path.join(config.paths.build, config.tasks.fonts.dest),
    release: path.join(config.paths.release, config.tasks.fonts.dest)
};

// Fonts Task
gulp.task('fonts', false, function () {
    return gulp.src( fontspath.src )
        .pipe(gulp.dest( global.release ? fontspath.release : fontspath.dest ) );
});

// JS Path
var scriptpath = {
    src: path.join( config.paths.source, config.tasks.script.src, '/*.'+ config.tasks.js.extensions ),
    dest: path.join( config.paths.build, config.tasks.script.dest ),
    release: path.join( config.paths.release, config.tasks.script.dest ),
};

// JS Task
gulp.task('script', false, function () {
    return gulp.src( scriptpath.src )
        .pipe( gulp.dest(global.release ? scriptpath.release : scriptpath.dest) )
        .pipe( browserSync.stream()) ;
});

// Local Server
gulp.task('serve', false, function() {

  browserSync.init( config.tasks.browsersync );

  gulp.watch( htmlpath.src, ['html']);
  gulp.watch( csspath.src , ['sass']);
  gulp.watch( imagespath.src, ['images']);
  gulp.watch( jspath.src, ['js']);
  gulp.watch( scriptpath.src, ['script']);

});

// Release
gulp.task('build:release', false, function(){
    global.release = true;
   //runSequence('html', 'sass', 'js', 'images', 'fonts', 'script');
   runSequence('html', 'sass', 'js', 'fonts', 'script');
});

// define workflows
gulp.task('build', 'Compile to development environment.', ['html', 'sass', 'js', 'images', 'fonts', 'script']);
gulp.task('run', 'Start webserver and listen changes.', ['build', 'serve']);
gulp.task('release', 'Compile to production environment.', ['build:release']);
gulp.task('test', 'Execute JSLint & SassLint check', ['jslint', 'sasslint']);
gulp.task('test:visual', 'Make Visual regresion check', ['webserver', 'phantomcss']);
