/*globals describe, beforeEach, inject, module, it, expect, angular */

describe('Module: LocalForageModule', function () {
    'use strict';

    it('service should be defined', function () {
        var $injector = angular.injector(['LocalForageModule']);
        var myService = $injector.get('$localForage');
        expect(myService.setDriver).toBeDefined();
        expect(myService.getDriver).toBeDefined();
        expect(myService.set).toBeDefined();
        expect(myService.get).toBeDefined();
        expect(myService.remove).toBeDefined();
        expect(myService.clearAll).toBeDefined();
        expect(myService.getKeyAt).toBeDefined();
        expect(myService.getKeys).toBeDefined();
        expect(myService.getLength).toBeDefined();
        expect(myService.bind).toBeDefined();
        expect(myService.unbind).toBeDefined();
    });
});