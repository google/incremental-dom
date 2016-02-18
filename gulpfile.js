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
var fs = require('fs');
var gjslint = require('gulp-gjslint');
var gulp = require('gulp');
var gutil = require('gulp-util');
var karma = require('karma').server;
var path = require('path');
var replace = require('gulp-replace');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

var entryFileName = 'index.js';
var artifactName = 'incremental-dom';
var googModuleName = 'incrementaldom';
var jsFileName = 'incremental-dom.js';
var srcs = [jsFileName, 'src/**/*.js'];
var tests = ['test/**/*.js'];
var karmaConfig = path.resolve('conf/karma.conf.js');

function clean() {
  return del(['dist/']);
}

function unit(done) {
  karma.start({
    configFile: karmaConfig,
    singleRun: true,
    browsers: ['Chrome', 'Firefox']
  }, done);
}

function unitPhantom(done) {
  karma.start({
    configFile: karmaConfig,
    singleRun: true,
    browsers: ['PhantomJS']
  }, done);
}

function unitWatch(done) {
  karma.start({
    configFile: karmaConfig,
    browsers: ['Chrome']
  }, done);
}

function lint() {
  return gulp.src(srcs, tests)
    .pipe(gjslint())
    .pipe(gjslint.reporter('console'))
    .pipe(gjslint.reporter('fail'));
}

function inlineEnv() {
  return babel({
    plugins: [
      'transform-inline-environment-variables'
    ]
  });
}

function bundle(format) {
  return rollup.rollup({
    entry: entryFileName,
  }).then(function(bundle) {
    return bundle.generate({
      format: format,
      banner: fs.readFileSync('conf/license_header.txt', 'utf8'),
      sourceMap: true,
      moduleName: 'IncrementalDOM'
    });
  }).then(function(gen) {
    gen.code += '\n//# sourceMappingURL=' + gen.map.toUrl();
    return gen;
  });
}

function js() {
  process.env.NODE_ENV = 'development';

  return bundle('umd').then(function(gen) {
    return file(artifactName + '.js', gen.code, {src: true})
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(inlineEnv())
      .pipe(babel())
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('dist'));
  });
}

function jsWatch() {
  gulp.watch(srcs, ['js']);
}

function jsMin() {
  process.env.NODE_ENV = 'production';

  return bundle('umd').then(function(gen) {
    return file(artifactName + '-min.js', gen.code, {src: true})
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(inlineEnv())
      .pipe(babel())
      .pipe(uglify({
        preserveComments: 'some'
      }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('dist'));
  });
}

function jsClosure(done) {
  return bundle('cjs').then(function(gen) {
    // Replace the first line with a goog.module declaration.
    var moduleDeclaration = 'goog.module(\'' + googModuleName + '\');';
    var code = gen.code.replace(/.*/, moduleDeclaration)
                       .replace(/'use strict';/, '');

    return file(artifactName + '-closure.js', code, {src: true})
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(replace('process.env.NODE_ENV !== \'production\'', 'goog.DEBUG'))
      .pipe(babel())
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('dist'));
  });
}

function jsCommonJS() {
  return bundle('cjs').then(function(gen) {
    return file(artifactName + '-cjs.js', gen.code, {src: true})
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(babel())
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('dist'));
  });
}

function jsDist() {
  // These must be run serially: clean must complete before any of the js
  // targets run. The js and jsMin targets cannot run in parallel as they both
  // change process.env.NODE_ENV. The CommonJS target could run in parallel
  // with the js and jsMin targets, but currently is not.
  return clean()
    .then(jsCommonJS)
    .then(js)
    .then(jsMin);
}

gulp.task('clean', clean);
gulp.task('unit', unit);
gulp.task('unit-phantom', unitPhantom);
gulp.task('unit-watch', unitWatch);
gulp.task('lint', lint);
gulp.task('js', js);
gulp.task('js-watch', jsWatch);
gulp.task('js-min', jsMin);
gulp.task('js-dist', jsDist);
gulp.task('js-closure', jsClosure);
gulp.task('build', ['lint', 'unit', 'js']);
gulp.task('dist', ['lint', 'unit-phantom', 'js-dist']);

gulp.task('default', ['build']);
