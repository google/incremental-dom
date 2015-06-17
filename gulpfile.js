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
var envify = require('envify');
var git = require('gulp-git');
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

function clean(done) {
  del(['dist'], done);
}

function unit(done) {
  karma.start({
    configFile: path.resolve('karma.conf.js'),
    singleRun: true,
    files: tests
  }, done);
}

function unitWatch(done) {
  karma.start({
    configFile: path.resolve('karma.conf.js'),
    files: tests,
    browsers: ['Chrome']
  }, done);
}

function lint() {
  return gulp.src(srcs, tests)
    .pipe(gjslint())
    .pipe(gjslint.reporter('console'))
}

var customBrowserifyOpts = {
  entries: './index.js',
  standalone: 'IncrementalDOM',
  debug: true
};

function bundle(browserify, env) {
  return browserify
    .transform(envify, env)
    .bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source(jsFileName))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(uglify())
      .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist'));
}

function js() {
  var b_plain = browserify(customBrowserifyOpts);

  return bundle(b_plain, {});
}

function jsWatch() {
  var opts = assign({}, watchify.args, customBrowserifyOpts);
  var b_watch = watchify(browserify(opts));

  b_watch.on('update', bundle.bind(null, b_watch));
  b_watch.on('log', gutil.log);
  
  return bundle(b_watch, {});
}

function jsDist() {
  var b_plain = browserify(customBrowserifyOpts);

  return bundle(b_plain, {
    _: 'purge',
    NODE_ENV: 'production'
  });
}

function addDist() {
  return gulp.src('dist')
    .pipe(git.add({
      args: '-f'
    }));
}

gulp.task('clean', clean);
gulp.task('unit', unit);
gulp.task('unit-watch', unitWatch);
gulp.task('lint', lint);
gulp.task('js', js);
gulp.task('js-watch', jsWatch);
gulp.task('js-dist', jsDist);
gulp.task('build', ['lint', 'unit', 'js']);
gulp.task('dist', ['lint', 'unit', 'js-dist'], function() {
  return addDist();
});

gulp.task('default', ['build']);
