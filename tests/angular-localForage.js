/*globals describe, beforeEach, inject, module, it, expect, angular */

describe('Module: LocalForageModule', function () {
    'use strict';

    it('service should be defined', function () {
        var $injector = angular.injector(['LocalForageModule']);
        var myService = $injector.get('$localForage');
        expect(myService).toBeDefined();
    });

    it('service:setDriver should be defined', function () {
        var $injector = angular.injector(['LocalForageModule']);
        var myService = $injector.get('$localForage');
        expect(myService.setDriver).toBeDefined();
    });

    it('service:getDriver should be defined', function () {
        var $injector = angular.injector(['LocalForageModule']);
        var myService = $injector.get('$localForage');
        expect(myService.getDriver).toBeDefined();
    });

    it('service:set should be defined', function () {
        var $injector = angular.injector(['LocalForageModule']);
        var myService = $injector.get('$localForage');
        expect(myService.set).toBeDefined();
    });

    it('service:get should be defined', function () {
        var $injector = angular.injector(['LocalForageModule']);
        var myService = $injector.get('$localForage');
        expect(myService.get).toBeDefined();
    });

    it('service:remove should be defined', function () {
        var $injector = angular.injector(['LocalForageModule']);
        var myService = $injector.get('$localForage');
        expect(myService.remove).toBeDefined();
    });

    it('service:clearAll should be defined', function () {
        var $injector = angular.injector(['LocalForageModule']);
        var myService = $injector.get('$localForage');
        expect(myService.clearAll).toBeDefined();
    });

    it('service:getKeyAt should be defined', function () {
        var $injector = angular.injector(['LocalForageModule']);
        var myService = $injector.get('$localForage');
        expect(myService.getKeyAt).toBeDefined();
    });

    it('service:getKeys should be defined', function () {
        var $injector = angular.injector(['LocalForageModule']);
        var myService = $injector.get('$localForage');
        expect(myService.getKeys).toBeDefined();
    });

    it('service:getLength should be defined', function () {
        var $injector = angular.injector(['LocalForageModule']);
        var myService = $injector.get('$localForage');
        expect(myService.getLength).toBeDefined();
    });

    it('service:bind should be defined', function () {
        var $injector = angular.injector(['LocalForageModule']);
        var myService = $injector.get('$localForage');
        expect(myService.bind).toBeDefined();
    });

    it('service:unbind should be defined', function () {
        var $injector = angular.injector(['LocalForageModule']);
        var myService = $injector.get('$localForage');
        expect(myService.unbind).toBeDefined();
    });

    it('directive should be defined', function () {
        var $injector = angular.injector(['LocalForageModule']);
    });
});