/*globals module, config */

module.exports = function (config) {
    'use strict';

    config.set({
        basePath   : '',
        frameworks : ['jasmine'],
        files      : [
            'bower_components/angular/angular.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'bower_components/localforage/dist/localforage.min.js',
            'angular-localForage.js',
            'tests/angular-localForage.js'
        ],
        colors    : true,
        exclude   : [
        ],
        port      : 9876,
        logLevel  : config.LOG_INFO,
        autoWatch : true,
        browsers  : ['Chrome', 'Firefox'],
        singleRun : true
    });
};