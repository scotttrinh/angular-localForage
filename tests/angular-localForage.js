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
	    expect(typeof myService.setDriver).toBe('function');
    });

    it('service:driver should be defined', function () {
        expect(myService.driver).toBeDefined();
	    expect(typeof myService.driver).toBe('function');
    });

    it('service:set should be defined', function () {
        expect(myService.setItem).toBeDefined();
	    expect(typeof myService.set).toBe('function');
    });

    it('service:get should be defined', function () {
        expect(myService.getItem).toBeDefined();
	    expect(typeof myService.getItem).toBe('function');
    });

    it('service:remove should be defined', function () {
        expect(myService.remove).toBeDefined();
	    expect(typeof myService.remove).toBe('function');
    });

    it('service:clear should be defined', function () {
        expect(myService.clear).toBeDefined();
	    expect(typeof myService.clear).toBe('function');
    });

    it('service:clear should works', function () {
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

    it('service:key should be defined', function () {
        expect(myService.key).toBeDefined();
	    expect(typeof myService.key).toBe('function');
    });

    it('service:keys should be defined', function () {
        expect(myService.keys).toBeDefined();
	    expect(typeof myService.keys).toBe('function');
    });

    it('service:length should be defined', function () {
        expect(myService.length).toBeDefined();
        expect(typeof myService.length).toBe('function');
    });

    it('service:bind should be defined', function () {
        expect(myService.bind).toBeDefined();
	    expect(typeof myService.bind).toBe('function');
    });

    it('service:unbind should be defined', function () {
        expect(myService.unbind).toBeDefined();
	    expect(typeof myService.unbind).toBe('function');
    });

    it('directive should be defined', function () {
        var $injector = angular.injector(['LocalForageModule']);
	    // todo
    });

    it('service:setItem and getItem should work', function() {
	    var result = null;
        function run(driver) {
            myService.setDriver(driver);
            myService.clear();
            myService.setItem('myName', 'Olivier Combe').then(function() {
                myService.getItem('myName').then(function(data) {
                    result = data;
                }, function() {
                    result = false;
                });
            }, function() {
                result = false;
            });

            waitsFor(function() {
                return result !== null;
            });

            runs(function() {
                expect(result).toEqual('Olivier Combe');
            });
        }

        run('asyncStorage');
        run('localStorageWrapper');
        if (window.openDatabase) {
            run('webSQLStorage');
        }
    });

});