/*globals describe, beforeEach, afterEach, inject, module, it, expect, angular */

describe('Module: LocalForageModule', function () {
    'use strict';

    var rootScope,
        $injector,
        myService,
        spies = {};

    beforeEach(inject(function ($rootScope) {
        rootScope = $rootScope;
        $injector = angular.injector(['LocalForageModule']);
        myService = $injector.get('$localForage');

        spies.getKeys = spyOn(myService, 'getKeys');
    }));

    afterEach(function () {
        rootScope.$apply();
    });

    it('service should be defined', function () {
        expect(myService).toBeDefined();
    });

    it('service:setDriver should be defined', function () {
        expect(myService.setDriver).toBeDefined();
    });

    it('service:getDriver should be defined', function () {
        expect(myService.driver).toBeDefined();
    });

    it('service:set should be defined', function () {
        expect(myService.setItem).toBeDefined();
    });

    it('service:get should be defined', function () {
        expect(myService.getItem).toBeDefined();
    });

    it('service:remove should be defined', function () {
        expect(myService.removeItem).toBeDefined();
    });

    it('service:clearAll should be defined', function () {
        expect(myService.clear).toBeDefined();
    });

    it('service:clearAll should works', function () {
        var promise_expected = myService.clear();
//        rootScope.$digest();
//        expect(spies.getKeys).toHaveBeenCalled();
//        expect(promise_expected).toBeDefined();
//        expect(promise_expected).not.toBe(null);
//        expect(typeof promise_expected).toBe('object');
//        expect(promise_expected.always).toBeDefined();
//        expect(promise_expected.always).not.toBe(null);
//        expect(promise_expected.then).toBeDefined();
//        expect(promise_expected.then).not.toBe(null);
    });

    it('service:getKeyAt should be defined', function () {

        expect(myService.key).toBeDefined();
    });

    it('service:getKeys should be defined', function () {
        expect(myService.getKeys).toBeDefined();
    });

    it('service:getLength should be defined', function () {
        expect(myService.length).toBeDefined();
        expect(typeof myService.getLength).toBe('function');
    });

    it('service:getLength should works', function () {
        var length_expected = myService.getLength();

        expect(typeof myService.length).toBeDefined();
    });

    it('service:bind should be defined', function () {
        expect(myService.bind).toBeDefined();
    });

    it('service:unbind should be defined', function () {
        expect(myService.unbind).toBeDefined();
    });

    it('directive should be defined', function () {
        var $injector = angular.injector(['LocalForageModule']);
    });

    iit('should set and get', function () {

        var result;

        myService.clearAll();
        myService.setItem('myName', 'Olivier Combe').then(function () {
            console.log('le set !');
            myService.getItem('myName').then(function (data) {
                console.log('le get !', data);
                result = data;
            });
        });

        expect(result).toEqual('Olivier Combe');
    });

});