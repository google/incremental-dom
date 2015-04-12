module.exports = function(config) {
  config.set({
    frameworks: ['browserify', 'mocha', 'sinon-chai'],

    preprocessors: {
      'src/**/*.js': ['browserify'],
      'test/**/*.js': ['browserify']
    },

    browserify: {
      watch: true,
      debug: true,
      transform: ['es6ify']
    },

    reporters: ['progress'],

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: true,

    browsers: ['Chrome', 'Firefox']
  });
};
