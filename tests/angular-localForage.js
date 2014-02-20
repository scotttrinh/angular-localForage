/*globals describe, beforeEach, inject, module, it, expect, angular */

describe('Module: LocalForageModule', function () {
    'use strict';

    it('service should be defined', function () {
        var $injector = angular.injector(['LocalForageModule']);
        var myService = $injector.get('$localForage');
        expect(myService.setDriver).toBeDefined();
    });
});