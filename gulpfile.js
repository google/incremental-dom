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

var babel = require('gulp-babel');
var del = require('del');
var rollup = require('rollup');
var file = require('gulp-file');
var gjslint = require('gulp-gjslint');
var gulp = require('gulp');
var gutil = require('gulp-util');
var karma = require('karma').server;
var path = require('path');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

var entryFileName = 'index.js';
var artifactName = 'incremental-dom';
var googModuleName = 'incrementaldom';
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

function bundle(format) {
  return rollup.rollup({
    entry: entryFileName,
  }).then(function(bundle) {
    return bundle.generate({
      format: format,
      sourceMap: 'inline',
      moduleName: 'IncrementalDOM'
    });
  });
}

function js(done) {
  bundle('umd').then(function(gen) {
    file(artifactName + '.js', gen.code, {src: true})
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(babel())
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('dist'))
      .on('error', done)
      .on('end', done);
  }).catch(done);
}

function jsWatch() {
  gulp.watch(srcs, ['js']);
}

function jsMin(done) {
  process.env.NODE_ENV = 'production';

  bundle('umd').then(function(gen) {
    file(artifactName + '-min.js', gen.code, {src: true})
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(babel())
      .pipe(uglify({
        preserveComments: 'some'
      }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('dist'))
      .on('error', done)
      .on('end', done);
  }).catch(done);
}

function jsClosure(done) {
  process.env.NODE_ENV = 'production';

  bundle('cjs').then(function(gen) {
    // Replace the first line, 'use strict';, with a goog.module declaration.
    var moduleDeclaration = 'goog.module(\'' + googModuleName + '\');';
    var code = gen.code.replace(/.*/, moduleDeclaration);

    file(artifactName + '-closure.js', code, {src: true})
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(babel())
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('dist'))
      .on('error', done)
      .on('end', done);
  }).catch(done);
}

gulp.task('clean', clean);
gulp.task('unit', unit);
gulp.task('unit-watch', unitWatch);
gulp.task('lint', lint);
gulp.task('js', js);
gulp.task('js-watch', jsWatch);
gulp.task('js-min', jsMin);
gulp.task('js-dist', ['js', 'js-min']);
gulp.task('js-closure', jsClosure);
gulp.task('build', ['lint', 'unit', 'js']);
gulp.task('dist', ['clean', 'lint', 'unit', 'js-dist']);

gulp.task('default', ['build']);
