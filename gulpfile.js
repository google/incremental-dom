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

var gulp = require('gulp');
var del = require('del');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var rollup = require('rollup-stream');
var closureCompiler = require('google-closure-compiler').gulp();
var babel = require('rollup-plugin-babel');
var uglify = require('rollup-plugin-uglify');
var rollupReplace = require('rollup-plugin-replace');
var eslint = require('gulp-eslint');
var sourcemaps = require('gulp-sourcemaps');
var replace = require('gulp-replace');
var karma = require('karma');
var path = require('path');
var buffer = require('vinyl-buffer');
var fs = require('fs');

var entryFileName = 'index.js';
var artifactName = 'incremental-dom';
var googModuleName = 'incrementaldom';
var srcs = [entryFileName, 'src/**/*.js'];
var tests = ['test/**/*.js'];
var karmaConfig = path.resolve('conf/karma.conf.js');

function clean() {
  return del(['dist/']);
}

function unit(done) {
  new karma.Server({
    configFile: karmaConfig,
    singleRun: true,
    browsers: ['Chrome', 'Firefox']
  }, done).start();
}

function unitDist(done) {
  new karma.Server({
    configFile: karmaConfig,
    singleRun: true,
    browsers: ['chromeNoSandbox']
  }, done).start();
}

function unitWatch(done) {
  new karma.Server({
    configFile: karmaConfig,
    browsers: ['Chrome']
  }, done).start();
}

function lint() {
  return gulp.src(srcs.concat(tests))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}

function bundle(format, development, minify, runBabel) {
  return rollup({
    input: entryFileName,
    sourcemap: true,
    banner: fs.readFileSync('./conf/license_header.txt'),
    plugins: [
      rollupReplace({
        'globalObj.DEBUG': development
      }),
      minify ? uglify({
        output: { comments: /@license/ },
        compress: { keep_fargs: false }
      }) : {},
      runBabel ? babel({
        exclude: 'node_modules/**'
      }) : {}
    ],
    format: format,
    name: 'IncrementalDOM',
    treeshake: false,
  });
}

function js() {
  return bundle('umd', 'true', false, true)
    .pipe(source(artifactName + '.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'));
}

function jsWatch() {
  gulp.watch(srcs, ['js']);
}

function jsMinWatch() {
  gulp.watch(srcs, ['js-min']);
}

function jsMin() {
  return bundle('umd', 'false', true, true)
    .pipe(source(artifactName + '-min.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'));
}

function jsClosure(done) {
  var moduleDeclaration = 'goog.module(\'' + googModuleName + '\');';

  return bundle('cjs', 'goog.DEBUG', false, false)
    .pipe(source(artifactName + '-closure.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(replace(/('|")use strict\1;/, moduleDeclaration))
    .pipe(replace('Object.defineProperty(exports, \'__esModule\', { value: true });', ''))
    .pipe(replace(' global ', ' undefined ')) 
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'));
}

function jsCommonJS() {
  return bundle('cjs', "process.env.NODE_ENV !== 'production'", false, true)
    .pipe(source(artifactName + '-cjs.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'));
}

function jsDist() {
  // These must be run serially: clean must complete before any of the js
  // targets run. The js and jsMin targets cannot run in parallel as they both
  // change process.env.NODE_ENV. The CommonJS target could run in parallel
  // with the js and jsMin targets, but currently is not.
  return clean()
    .then(jsClosureChecks)
    .then(jsCommonJS)
    .then(js)
    .then(jsMin);
}

function jsClosureChecks() {
  return gulp.src(srcs)
    .pipe(replace(' global ', ' undefined ')) 
    .pipe(closureCompiler({
      checks_only: 'true',
      externs: 'node_externs.js',
      jscomp_error: 'checkTypes',
      language_in: 'ECMASCRIPT6_STRICT',
      warning_level: 'VERBOSE'
    }));
}

gulp.task('clean', clean);
gulp.task('unit', unit);
gulp.task('unit-dist', unitDist);
gulp.task('unit-watch', unitWatch);
gulp.task('lint', lint);
gulp.task('js', js);
gulp.task('js-watch', ['js'], jsWatch);
gulp.task('js-min', jsMin);
gulp.task('js-min-watch', ['js-min'], jsMinWatch);
gulp.task('js-dist', jsDist);
gulp.task('js-closure', jsClosure);
gulp.task('js-closure-checks', jsClosureChecks);
gulp.task('build', ['lint', 'unit'], js);
gulp.task('dist', ['lint', 'unit-dist'], jsDist);

gulp.task('default', ['build']);
