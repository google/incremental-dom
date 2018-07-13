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
var babel = require('rollup-plugin-babel');
var uglify = require('rollup-plugin-uglify');
var rollupReplace = require('rollup-plugin-replace');
var sourcemaps = require('gulp-sourcemaps');
var replace = require('gulp-replace');
var karma = require('karma');
var path = require('path');
var buffer = require('vinyl-buffer');
var fs = require('fs');
var typescript = require('rollup-plugin-typescript');

var entryFileName = 'index.ts';
var artifactName = 'incremental-dom';
var googModuleName = 'incrementaldom';
var srcs = [entryFileName, 'src/**/*.ts'];
var tests = ['test/**/*.ts'];
var karmaConfig = path.resolve('conf/karma.conf.js');

function clean() {
  return del(['dist/']);
}

function unit(done) {
  new karma
      .Server(
          {
            configFile: karmaConfig,
            singleRun: true,
            browsers: ['Chrome', 'Firefox']
          },
          () => done())
      .start();
}

function unitDist(done) {
  new karma
      .Server(
          {
            configFile: karmaConfig,
            singleRun: true,
            browsers: ['chromeNoSandbox']
          },
          done)
      .start();
}

function unitWatch(done) {
  new karma
      .Server({configFile: karmaConfig, browsers: ['Chrome']}, done)
      .start();
}

function getReplacementConfig(development) {
  var config = {
    'if \\(DEBUG': null,
  };

  // The plugin looks up the matched part as a string, but we cannot have `(`
  // as the replacement target since it is used in a RegExp. So the above
  // allows finding the match, and this tells the plugin what to replace it
  // with. This is non-enumerable so it isn't added to the replacment RegExp.
  Object.defineProperty(config, 'if (DEBUG', {
    'enumerable': false,
    'value': 'if (' + development,
  });

  return config;
}

function bundle(format, development, minify, runBabel) {
  return rollup({
    input: entryFileName,
    sourcemap: true,
    banner: fs.readFileSync('./conf/license_header.txt'),
    plugins: [
      typescript({typescript: require('typescript')}),
      rollupReplace(getReplacementConfig(development)),
      minify ? uglify({
        output: {comments: /@preserve/},
        compress: {keep_fargs: false}
      }) :
               {},
      runBabel ? babel({exclude: 'node_modules/**'}) : {}
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


function jsCommonJS() {
  return bundle('cjs', 'process.env.NODE_ENV !== \'production\'', false, true)
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
  return clean().then(jsCommonJS).then(js).then(jsMin);
}

gulp.task('clean', clean);
gulp.task('unit', unit);
gulp.task('unit-dist', unitDist);
gulp.task('unit-watch', unitWatch);
gulp.task('js', js);
gulp.task('js-watch', ['js'], jsWatch);
gulp.task('js-min', jsMin);
gulp.task('js-min-watch', ['js-min'], jsMinWatch);
gulp.task('js-dist', jsDist);
gulp.task('build', ['unit'], js);
gulp.task('dist', ['unit-dist'], jsDist);

gulp.task('default', ['build']);
