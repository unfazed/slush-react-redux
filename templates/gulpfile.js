'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var webserver = require('gulp-webserver');
var concatCSS = require('gulp-concat-css');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var mainBowerFiles = require('gulp-main-bower-files');
var glob = require('glob');
var browserify = require('browserify');
var babelify = require('babelify');
var fs = require('fs');
var path = require('path');

gulp.task('compile', function () {
    glob('src/app/scripts/*.js', function(err, files){
        if(err) done(err);
        files.map(function(entry) {
            var filename = path.basename(entry);
            browserify(entry)
                .transform("babelify", {presets: ["es2015", "react"]})
                .bundle()
                .pipe(fs.createWriteStream("build/js/" + filename));
        });
    });
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
gulp.task('build', ['compile', 'bower', 'concatCSS', 'copyToBuild']);

// dist
gulp.task('dist', ['build', 'uglifyJS', 'uglifyCSS', 'copyToDist']);
