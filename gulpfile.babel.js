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
import source from 'vinyl-source-stream';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';
import watchify from 'watchify';
import fs from 'fs';

const jsFileName = 'incremental-dom.js';
const srcs = [jsFileName, 'src/**/*.js'];
const tests = ['test/functional/**/*.js'];

const customBrowserifyOpts = {
  entries: './index.js',
  standalone: 'IncrementalDOM',
  debug: true
};

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

function bundle(browserify, env) {
  return browserify
    .transform(envify, env)
    .bundle()
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

function js() {
  let b_plain = browserify(customBrowserifyOpts);

  return bundle(b_plain, {});
}

function jsWatch() {
  let opts = assign({}, watchify.args, customBrowserifyOpts);
  let b_watch = watchify(browserify(opts));

  b_watch.on('update', bundle.bind(null, b_watch));
  b_watch.on('log', gutil.log);

  return bundle(b_watch, {});
}

function jsDist(done) {
  esperanto.bundle({
    entry: 'index.js'
  }).then(function(bundle) {
    var res = bundle.toUmd({
      strict: true,
      name: 'IncrementalDOM',
      sourceMap: true,
      sourceMapFile: 'incremental-dom.js',
      sourceMapSource: 'incremental-dom.js'
    });

    fs.writeFileSync('./dist/incremental-dom.js', res.code.toString());
    fs.writeFileSync('./dist/incremental-dom.js.map', res.map.toString());
    done();
  }).catch(done);
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
gulp.task('dist', ['lint', 'unit', 'js-dist'], addDist);

gulp.task('default', ['build']);
