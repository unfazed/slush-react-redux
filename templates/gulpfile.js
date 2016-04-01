'use strict';

var gulp = require("gulp");
var gutil = require("gulp-util");
var webserver = require("gulp-webserver");
var concatCSS = require("gulp-concat-css");
var cssmin = require("gulp-cssmin");
var uglify = require("gulp-uglify");
var mainBowerFiles = require("gulp-main-bower-files");
var named = require("vinyl-named");
var webpack = require("webpack-stream");
var clean = require("gulp-clean");

var src = {
    base: "src/",
    jsx: "src/scripts/jsx/*.jsx",
    scripts: "src/scripts/*.js",
    styles: "src/styles/**/*.css",
    images: "src/images/**/*",
    bower: "./bower.json",
    webpack: require("./webpack.config.js")
};

var dist = {
    base: "dist/",
    app: "dist/scripts/app/",
    scripts: "dist/scripts/",
    vendors: "dist/scripts/vendors/",
    styles: "dist/styles/",
    images: "dist/images/"
};

// 打包 jsx
gulp.task('webpack', function () {
    return gulp.src(src.jsx)
        .pipe(named())
        .pipe(webpack(src.webpack))
        .pipe(gulp.dest(dist.app));
});

//合并 CSS
gulp.task("concat:css", function () {
    return gulp.src(src.styles)
        .pipe(concatCSS("app.css"))
        .pipe(gulp.dest(dist.styles));
});

//拷贝 images
gulp.task("copy:images", function () {
    return gulp.src(src.images)
        .pipe(gulp.dest(dist.images));
});

//拷贝 js
gulp.task("copy:javascript", function () {
    return gulp.src(src.scripts)
        .pipe(gulp.dest(dist.scripts));
});

//拷贝 bower_components 主文件
gulp.task("copy:bower", function () {
    return gulp.src(src.bower)
        .pipe(mainBowerFiles( ))
        .pipe(gulp.dest(dist.vendors));
});

//拷贝根目录文件
gulp.task("copy:root", function () {
    return gulp.src(src.base + "*")
        .pipe(gulp.dest(dist.base));
});

// 压缩JS
gulp.task("minify:javascript", function () {
    return gulp.src(dist.scripts + "**/*.js")
        .pipe(uglify())
        .pipe(gulp.dest(dist.scripts));
});

// 压缩CSS
gulp.task("minify:css", function () {
    return gulp.src(dist.styles + "**/*.css")
        .pipe(cssmin())
        .pipe(gulp.dest(dist.styles));
});

// 监听CSS变化
gulp.task("watch:css", function () {
    gulp.watch(src.styles, ["concat:css"]);
});

// 监听jsx变化
gulp.task("watch:jsx", function () {
    gulp.watch(src.jsx, ["webpack"]);
});

// 监听javascript变化
gulp.task("watch:javascript", function () {
    gulp.watch(src.scripts, ["copy:javascripts"]);
});

//监听图片变化
gulp.task("watch:images", function () {
    gulp.watch(src.images, ["copy:images"]);
});

//监听根目录文件变化
gulp.task("watch:root", function () {
    gulp.watch(src.base + "*", ["copy:root"]);
});

// 删除 images
gulp.task("clean:images", function () {
    return gulp.src(dist.images + "*")
        .pipe(clean());
});

// 删除 javascript
gulp.task("clean:javascript", function () {
    return gulp.src([dist.app + "*", dist.vendors + "*", dist.scripts + "*.js"])
        .pipe(clean());
});

// 删除 styles
gulp.task("clean:css", function () {
    return gulp.src(dist.styles + "*.css")
        .pipe(clean());
});

// 启动服务
gulp.task('server', function () {
  var host = gutil.env.host || "127.0.0.1",
      port = gutil.env.port || 3000;

  gulp.src(dist.base)
      .pipe(webserver({
        host: host,
        port: port
      }));
});

//clean
gulp.task("clean", ["clean:images", "clean:css", "clean:javascript"]);

//minify
gulp.task("minify", ["minify:javascript", "minify:css"]);

//copy
gulp.task("copy", ["copy:images", "copy:javascript", "copy:bower", "copy:root"]);

//watch
gulp.task("watch", ["watch:jsx", "watch:javascript", "watch:css", "watch:images", "watch:root"]);

//build
gulp.task("build", ["clean", "webpack", "concat:css", "copy"]);

//start
gulp.task("start", ["build", "server", "watch"]);

//dist
gulp.task("dist", ["build", "minify"]);
