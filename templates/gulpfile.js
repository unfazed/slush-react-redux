'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var webserver = require('gulp-webserver');
var babel = require('gulp-babel');
var watch = require('gulp-watch');
var concatCSS = require('gulp-concat-css');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var mainBowerFiles = require('gulp-main-bower-files');

gulp.task('pack', function () {
    return gulp.src('src/app/scripts/*.js')
        //babel
        .pipe(babel({
            presets: ['es2015']
        }))
        // browserify
        .pipe(browserify({
            insertGlobals : true,
            debug : gutil.env !== "production"
        }))
        .pipe(gulp.dest('build/js'));
});

// concat css
gulp.task('concatCSS', function () {
    return gulp.src('src/app/styles/**/*.css')
        .pipe(concatCSS('app.css'))
        .pipe(gulp.dest('build/css'));
});

// copy to build(images,root files)
gulp.task('copyToBuild', function () {
    return gulp.src(['src/app/images/**/*', 'src/app/*'])
        .pipe(gulp.dest('build'));
});

// copy to dist(images,root files)
gulp.task('copyToDist', function () {
    return gulp.src(['build/images/**/*', 'build/*'])
        .pipe(gulp.dest('dist'));
});

// uglify js
gulp.task('uglifyJS', function () {
    return gulp.src('build/js/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

// uglify css
gulp.task('uglifyCSS', function () {
    return gulp.src('build/css/**/*.css')
        .pipe(cleanCSS())
        .pipe(gulp.dest('dist/css'));
});

// watch
gulp.task('watch', function () {
    gulp.watch('src/app/scripts/**/*.js', ['pack']);
    gulp.watch('src/app/styles/**/*.css', ['concatCSS']);
    gulp.watch(['src/app/images/**/*', 'src/app/*'], ['copyToBuild'])
});

// bower
gulp.task('bower', function () {
    return gulp.src('./bower.json')
        .pipe(mainBowerFiles( ))
        .pipe(gulp.dest('build/js/vendors'));
});

// server
gulp.task('server', function () {
  var host = gutil.env.host || '127.0.0.1',
      port = gutil.env.port || 3000;

  gulp.src('build')
      .pipe(webserver({
        host: host,
        port: port
      }));
});

// build
gulp.task('build', ['pack', 'concatCSS', 'copyToBuild']);

// dist
gulp.task('dist', ['build', 'uglifyJS', 'uglifyCSS', 'copyToDist']);
