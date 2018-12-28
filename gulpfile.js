"use strict";

var gulp = require("gulp");
var browserSync = require("browser-sync").create();
var htmlMin = require("gulp-htmlmin");
var sass = require("gulp-sass");
var cleanCss = require("gulp-clean-css");
var inlineCss = require("gulp-inline-css");
var panini = require("panini");
var inky = require("inky");

/* Compile SASS into Minify CSS */
gulp.task("sass", function() {
  return gulp
    .src("src/scss/*.scss")
    .pipe(sass())
    .pipe(cleanCss())
    .pipe(gulp.dest("dist/css"));
});

/* Integrate All Layout from Panini */
gulp.task("panini", function() {
  return gulp
    .src("src/pages/**/*.html")
    .pipe(
      panini({
        root: "src/pages/",
        layouts: "src/layouts/",
        partials: "src/partials/",
        data: "src/data/"
      })
    )
    .pipe(inky())
    .pipe(gulp.dest("dist/"));
});

/* Make HTML Clean and Minify, also Make CSS Inline on Tag */
gulp.task("htmlMin", function() {
  return gulp
    .src("dist/**/*.html")
    .pipe(
      htmlMin({
        collapseWhitespace: true,
        removeComments: true
      })
    )
    .pipe(inlineCss({
      removeHtmlSelectors: true
    }))
    .pipe(gulp.dest("dist/"));
});

/* Static Server */
gulp.task("browserSync", function() {
  browserSync.init({
    server: {
      baseDir: "./dist/"
    }
  });
});

/* Watch all Changes */
gulp.task("watch", function() {
  gulp.watch("src/scss/*.scss", gulp.parallel("sass"));
  gulp.watch("src/pages/**/*.html", gulp.parallel("panini"));
  gulp.watch("src/pages/**/*.html").on("change", browserSync.reload);
  gulp.watch("src/scss/*.scss").on("change", browserSync.reload);
});

/* Build emails, run the server, and watch for file changes */
gulp.task("default", gulp.parallel("sass", "panini", "watch", "browserSync"));

/* Build the "dist" folder by running all of the below tasks */
gulp.task("build", gulp.parallel("htmlMin"));
