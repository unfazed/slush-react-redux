'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var webserver = require('gulp-webserver');
var concatCSS = require('gulp-concat-css');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var mainBowerFiles = require('gulp-main-bower-files');
var named = require('vinyl-named');
var webpack = require('webpack-stream');

// 打包 jsx
gulp.task('webpack', function () {
    return gulp.src('src/scripts/jsx/*.jsx')
        .pipe(named())
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(gulp.dest('build/scripts/jsx'));
});

//合并 CSS
gulp.task('css', function () {
    return gulp.src('src/styles/**/*.css')
        .pipe(concatCSS('app.css'))
        .pipe(gulp.dest('build/styles'));
});

// 拷贝到构建目录
gulp.task('buildCopy', function () {
    return gulp.src(['src/images/**/*', 'src/scripts/*'])
        .pipe(gulp.dest('build'));
});

// 拷贝到打包目录
gulp.task('distCopy', function () {
    return gulp.src(['build/images/**/*', 'build/*'])
        .pipe(gulp.dest('dist'));
});

// 压缩JS
gulp.task('compressJS', function () {
    return gulp.src('build/scripts/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/scripts'));
});

// 压缩CSS
gulp.task('compressCSS', function () {
    return gulp.src('build/styles/**/*.css')
        .pipe(cleanCSS())
        .pipe(gulp.dest('dist/styles'));
});

// watch
gulp.task('watch', function () {
    gulp.watch('src/scripts/**/*.js', ['webpack', 'buildCopy']);
    gulp.watch('src/styles/**/*.css', ['css']);
    gulp.watch(['src/images/**/*', 'src/scripts/*'], ['copyToBuild'])
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
gulp.task('build', ['webpack', 'bower', 'concatCSS', 'copyToBuild']);

// 压缩
gulp.task('compress', ['compressJS', 'compressCSS']);

// dist
gulp.task('dist', ['build', 'uglifyJS', 'uglifyCSS', 'copyToDist']);
