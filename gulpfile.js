/**
 * Copyright 2015 The Incremental DOM Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var assign = require('lodash').assign;
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var del = require('del');
var gjslint = require('gulp-gjslint');
var gulp = require('gulp');
var gutil = require('gulp-util');
var karma = require('karma').server;
var path = require('path');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var watchify = require('watchify');

var jsFileName = 'incremental-dom.js';
var srcs = [jsFileName, 'src/**/*.js'];
var tests = ['test/functional/**/*.js'];

gulp.task('clean', function(cb) {
  del(['dist'], cb);
});

 
gulp.task('unit', function(done) {
  karma.start({
    configFile: path.resolve('karma.conf.js'),
    singleRun: true,
    files: tests
  }, done);
});

gulp.task('unit-watch', function(done) {
  karma.start({
    configFile: path.resolve('karma.conf.js'),
    files: tests,
    browsers: ['Chrome']
  }, done);
});

gulp.task('lint', function() {
  return gulp.src(srcs, tests)
    .pipe(gjslint())
    .pipe(gjslint.reporter('console'))
});


// Build with watch
var customOpts = {
  entries: './index.js',
  standalone: 'IncrementalDOM',
  debug: true,
  transform: [ 'envify' ]
};
var opts = assign({}, watchify.args, customOpts);
var b_watch = watchify(browserify(opts));
var b_plain = browserify(customOpts);

b_watch.on('update', bundle.bind(null, b_watch));
b_watch.on('log', gutil.log);

function bundle(browserify) {
  return browserify.bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source(jsFileName))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(uglify({
        preserveComments: 'some'    
      }))
      .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist'));
}

// Plain build
gulp.task('js', bundle.bind(null, b_plain));
gulp.task('js-watch', bundle.bind(null, b_watch));

gulp.task('default', ['lint', 'unit', 'js']);
