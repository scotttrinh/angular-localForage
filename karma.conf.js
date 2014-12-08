var customLaunchers = {
  sl_chrome: {
    base: 'SauceLabs',
    browserName: 'chrome'
  },
  sl_firefox: {
    base: 'SauceLabs',
    browserName: 'firefox',
    version: '30'
  },
  sl_safari: {
    base: 'SauceLabs',
    browserName: 'safari',
    platform: 'OS X 10.9',
    version: '7'
  },
  sl_ios_safari: {
    base: 'SauceLabs',
    browserName: 'iphone',
    platform: 'OS X 10.9',
    version: '7.1'
  },
  sl_ie_9: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 2008',
    version: '9'
  },
  sl_ie_10: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 2012',
    version: '10'
  },
  sl_ie_11: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 8.1',
    version: '11'
  }
};

module.exports = function(config) {
  config.set(module.exports.conf);

  if(process.env.TRAVIS) {
    config.sauceUser = process.env.SAUCE_USERNAME;
    config.sauceKey = process.env.SAUCE_ACCESS_KEY;

    var buildLabel = 'TRAVIS #' + process.env.TRAVIS_BUILD_NUMBER + ' (' + process.env.TRAVIS_BUILD_ID + ')';

    config.logLevel = config.LOG_DEBUG;
    config.transports = ['websocket', 'xhr-polling'];
    config.captureTimeout = 0; // rely on SL timeout

    config.sauceLabs.build = buildLabel;
    config.sauceLabs.startConnect = false;
    config.sauceLabs.tunnelIdentifier = process.env.TRAVIS_JOB_NUMBER;
    config.sauceLabs.recordScreenshots = true;

    // TODO(vojta): remove once SauceLabs supports websockets.
    // This speeds up the capturing a bit, as browsers don't even try to use websocket.
    config.transports = ['xhr-polling'];
  }
};

module.exports.conf = {
  frameworks: ['jasmine'],
  files: [
    'bower_components/angular/angular.js',
    'bower_components/angular-mocks/angular-mocks.js',
    'bower_components/localforage/dist/localforage.js',
    'src/angular-localForage.js',
    'tests/angular-localForage.js'
  ],
  autoWatch: false,
  singleRun: true,
  sauceLabs: {
    testName: 'angular-localforage unit tests',
    recordScreenshots: false,
    startConnect: true,
    options: {
      'selenium-version': '2.41.0'
    },
    connectOptions: {
      port: 5757,
      logfile: 'sauce_connect.log'
    }
  },
  // Increase timeout in case connection in CI is slow
  captureTimeout: 120000,
  browserDisconnectTimeout: 10000,
  browserDisconnectTolerance: 2,
  browserNoActivityTimeout: 30000,
  browsers: Object.keys(customLaunchers),
  customLaunchers: customLaunchers,
  reporters: ['progress', 'saucelabs'],
  port: 9876,
  colors: true
};
