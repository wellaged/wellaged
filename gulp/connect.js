'use strict';

var gulp = require('gulp');
var connect = require('gulp-connect');

// Start local dev server.
gulp.task('connect', function() {
  connect.server({
    port: 8088,
    root: global.paths.src,
    livereload: false
  });
});
