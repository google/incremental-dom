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

import assign from 'lodash.assign';
import browserify from 'browserify';
import esperanto from 'esperanto';
import buffer from 'vinyl-buffer';
import del from 'del';
import envify from 'envify';
import git from 'gulp-git';
import gjslint from 'gulp-gjslint';
import gulp from 'gulp';
import gutil from 'gulp-util';
import {server as karma} from 'karma';
import path from 'path';
import file from 'gulp-file';
import source from 'vinyl-source-stream';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';
import watchify from 'watchify';
import fs from 'fs';
import babel from 'gulp-babel';

const exportVarName = 'IncrementalDOM';
const entryFileName = 'index';
const exportFileName = 'incremental-dom';
const destinationFolder = 'dist';

const srcs = ['src/**/*.js'];
const tests = ['test/functional/**/*.js'];

const customBrowserifyOpts = {
  entries: './index.js',
  standalone: 'IncrementalDOM',
  debug: true
};

function clean(done) {
  del([destinationFolder], done);
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

function bundle(done) {
  esperanto.bundle({
    base: 'src',
    entry: entryFileName
  }).then(function(bundle) {
    var res = bundle.toUmd({
      sourceMap: true,
      sourceMapSource: entryFileName + '.js',
      sourceMapFile: exportFileName + '.js',
      name: exportVarName,
      strict: true
    });

    fs.writeFileSync(path.join(destinationFolder, exportFileName + '.js.map'), res.map.toString());

    file(exportFileName + '.js', res.code, { src: true })
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(babel({ blacklist: ['useStrict'], plugins: ['inline-environment-variables'] }))
      .pipe(uglify())
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(destinationFolder))
      .on('error', done)
      .on('end', done);
  }).catch(done);
}

function js(done) {
  bundle(done);
}

function jsWatch() {
  gulp.watch(srcs, ['js']);
}

function jsDist(done) {
  process.env.NODE_ENV = 'production';
  bundle(done);
}

function jsLib() {
  return gulp.src(srcs)
    .pipe(babel())
    .pipe(gulp.dest('lib'));
}

function addDist() {
  return gulp.src(destinationFolder)
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
gulp.task('js-lib', jsLib);
gulp.task('build', ['lint', 'unit', 'js']);
gulp.task('dist', ['lint', 'unit', 'js-dist', 'js-lib'], addDist);

gulp.task('default', ['build']);
