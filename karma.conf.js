'use strict';

module.exports = function (config) {
  config.set(module.exports.conf);
};

module.exports.conf = {
  frameworks : ['jasmine'],
  files: [
    'bower_components/angular/angular.js',
    'bower_components/angular-mocks/angular-mocks.js',
    'bower_components/localforage/dist/localforage.js',
    'src/angular-localForage.js',
    'tests/angular-localForage.js'
  ],
  autoWatch : true,
  browsers  : ['Chrome', 'Firefox'],
  singleRun : true
};
