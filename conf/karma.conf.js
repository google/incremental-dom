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

var babel = require('rollup-plugin-babel');
var multi = require('rollup-plugin-multi-entry').default;

module.exports = function(config) {
  config.set({
    frameworks: ['mocha', 'sinon-chai'],

    basePath: '../',

    files: [
      'test/util/globals.js',
      'test/unit/**/*.js',
      'test/functional/**/*.js'
    ],

    preprocessors: {
      'src/**/*.js': ['rollup'],
      'test/**/*.js': ['rollup']
    },

    rollupPreprocessor: {
      rollup: {
        plugins: [
          multi(),
          babel({
            exclude: ['node_modules/**', 'test/util/globals.js'],
            plugins: ['transform-inline-environment-variables']
          })
        ]
      },
      bundle: {
        intro: '(function() {',
        outro: '})();',
        sourceMap: 'inline'
      }
    },

    customLaunchers: {
      chromeNoSandbox: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },

    reporters: ['progress'],

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: true,

    // change Karma's debug.html to the mocha web reporter
    client: {
      mocha: {
        reporter: 'html'
      }
    }
  });
};
