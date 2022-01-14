module.exports = function(config) {
  // Karma tests fail with a Chrome sandbox error on macOS, so disable the
  // sandbox.
  if (process.platform === 'darwin') {
    config.set({
      browsers: ['ChromeHeadless_macos_fixed'],
      customLaunchers: {
        ChromeHeadless_macos_fixed: {
          base: 'ChromeHeadless',
          flags: [
            '--no-sandbox',
          ],
        },
      },
    });
  }
};
