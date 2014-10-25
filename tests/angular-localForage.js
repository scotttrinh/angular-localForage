/*globals describe, beforeEach, afterEach, inject, module, it, expect, angular */

describe('Module: LocalForageModule', function () {
    'use strict';

    var rootScope,
        $injector,
        myService,
        q,
        spies = {};

    beforeEach(inject(function ($rootScope, $q) {
        rootScope = $rootScope;
        q = $q;
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

    it('service:setItem should be defined', function () {
        expect(myService.setItem).toBeDefined();
	    expect(typeof myService.setItem).toBe('function');
    });

    it('service:get should be defined', function () {
        expect(myService.getItem).toBeDefined();
	    expect(typeof myService.getItem).toBe('function');
    });

    it('service:search should be defined', function () {
        expect(myService.search).toBeDefined();
        expect(typeof myService.search).toBe('function');
    });

    it('service:removeItem should be defined', function () {
        expect(myService.removeItem).toBeDefined();
	    expect(typeof myService.removeItem).toBe('function');
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
        function run(driver) {
	        return runs(function() {
	            return myService.setDriver(driver).then(function() {
		            return myService.clear().then(function() {
			            return myService.setItem('myName', 'Olivier Combe').then(function() {
				            return myService.getItem('myName').then(function(data) {
					            expect(data).toEqual('Olivier Combe');
				            }, function(res) {
					            console.log(res);
					            throw('Fail get item, driver = '+driver)
				            });
			            }, function(res) {
				            console.log(res);
				            throw('Fail set item, driver = '+driver)
			            });
		            }, function(res) {
			            console.log(res);
			            throw('Fail clear, driver = '+driver)
		            })
	            }, function() {
		            throw('Fail set driver '+driver)
	            })
	        });
        }

        run('asyncStorage');
        run('localStorageWrapper');
        run('webSQLStorage');
    });

    it('service:setItem should strip $$hashKey from arrays used in ngRepeat', function() {
        function run(driver) {
	        return runs(function() {
	            return myService.setDriver(driver).then(function() {
		            return myService.clear().then(function() {
			            return myService.setItem('myArray', [{$$hashKey: '00A', name:'Andrew Davis'}]).then(function() {
				            return myService.getItem('myArray').then(function(data) {
					            expect(data).toEqual([{name:'Andrew Davis'}]);
				            }, function(res) {
					            console.log(res);
					            throw('Fail get item, driver = '+driver)
				            });
			            }, function(res) {
				            console.log(res);
				            throw('Fail set item, driver = '+driver)
			            });
		            }, function(res) {
			            console.log(res);
			            throw('Fail clear, driver = '+driver)
		            })
	            }, function() {
		            throw('Fail set driver '+driver)
	            })
	        });
        }

        run('asyncStorage');
        run('localStorageWrapper');
        run('webSQLStorage');
    });


    it('service:search should work', function() {
        function run(driver) {
            return runs(function() {
                return myService.setDriver(driver).then(function() {
                    return myService.clear().then(function() {
                        q.all(myService.setItem('myName', 'Olivier Combe'),
                            myService.setItem('myPassion', 'AngularJs'),
                            myService.setItem('myHobbie', 'Open Source')
                        ).then(function(all_rets) {

                            var promises = [];
                            //test no filter
                            var d1 = q.defer();
                            myService.search(
                                function(key, value){
                                    return true;
                                }
                            ).then(function(data) {
                                expect(data.length).toEqual(3);
                                d1.resolve();
                            }, function(res) {
                                console.log(res);
                                throw('Fail search, driver = '+driver)
                                d1.reject();
                            });
                            promises.push(d1);

                            //test key filter
                            var d2 = q.defer();
                            myService.search(
                                function(key, value){
                                    return key == 'myPassion';
                                }
                            ).then(function(data) {
                                expect(data.length).toEqual(1);
                                expect(data[0]).toBe('AngularJs');
                                d2.resolve();
                            }, function(res) {
                                console.log(res);
                                throw('Fail search, driver = '+driver)
                                d2.reject();
                            });
                            promises.push(d2);

                            //test value filter
                            var d3 = q.defer();
                            myService.search(
                                function(key, value){
                                    return value == 'AngularJs';
                                }
                            ).then(function(data) {
                                expect(data.length).toEqual(1);
                                expect(data[0]).toBe('AngularJs');
                                d3.resolve();
                            }, function(res) {
                                console.log(res);
                                throw('Fail search, driver = '+driver)
                                d3.reject();
                            });
                            promises.push(d3);
                            return q.all(promises);
                        }, function(res) {
                            console.log(res);
                            throw('Fail set item, driver = '+driver)
                        });
                    }, function(res) {
                        console.log(res);
                        throw('Fail clear, driver = '+driver)
                    })
                }, function( res ) {
                    console.log(res);
                    throw('Fail sets driver '+driver)
                })
            });
        }

        // run('asyncStorage');
        run('localStorageWrapper');
        // run('webSQLStorage');
    });

});
