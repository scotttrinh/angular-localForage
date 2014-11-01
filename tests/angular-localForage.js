/*globals describe, beforeEach, afterEach, inject, module, it, expect, angular */

describe('Module: LocalForageModule', function() {
	'use strict';

	var $injector,
		$localForage,
		instanceVersion = 0,
		spies = {};

	beforeEach(inject(function() {
		$injector = angular.injector(['LocalForageModule']);
		$localForage = $injector.get('$localForage');

		spies.getKeys = spyOn($localForage, 'getKeys');
	}));

	afterEach(function(done) {
		// create a fresh instance
		$localForage.clear().then(function() {
			$localForage = $localForage.createInstance({
				name: ++instanceVersion
			});
			done();
		}, done);
	});

	it('service should be defined', function() {
		expect($localForage).toBeDefined();
	});

	it('service:setDriver should be defined', function() {
		expect($localForage.setDriver).toBeDefined();
		expect(typeof $localForage.setDriver).toBe('function');
	});

	it('service:driver should be defined', function() {
		expect($localForage.driver).toBeDefined();
		expect(typeof $localForage.driver).toBe('function');
	});

	it('service:setItem should be defined', function() {
		expect($localForage.setItem).toBeDefined();
		expect(typeof $localForage.setItem).toBe('function');
	});

	it('service:get should be defined', function() {
		expect($localForage.getItem).toBeDefined();
		expect(typeof $localForage.getItem).toBe('function');
	});

	it('service:search should be defined', function() {
		expect($localForage.search).toBeDefined();
		expect(typeof $localForage.search).toBe('function');
	});

	it('service:removeItem should be defined', function() {
		expect($localForage.removeItem).toBeDefined();
		expect(typeof $localForage.removeItem).toBe('function');
	});

	it('service:clear should be defined', function() {
		expect($localForage.clear).toBeDefined();
		expect(typeof $localForage.clear).toBe('function');
	});

	it('service:clear should works', function() {
		//todo
	});

	it('service:key should be defined', function() {
		expect($localForage.key).toBeDefined();
		expect(typeof $localForage.key).toBe('function');
	});

	it('service:keys should be defined', function() {
		expect($localForage.keys).toBeDefined();
		expect(typeof $localForage.keys).toBe('function');
	});

	it('service:length should be defined', function() {
		expect($localForage.length).toBeDefined();
		expect(typeof $localForage.length).toBe('function');
	});

	it('service:bind should be defined', function() {
		expect($localForage.bind).toBeDefined();
		expect(typeof $localForage.bind).toBe('function');
	});

	it('service:unbind should be defined', function() {
		expect($localForage.unbind).toBeDefined();
		expect(typeof $localForage.unbind).toBe('function');
	});

	it('directive should be defined', function() {
		// todo
	});

	// using default driver
	describe("IndexedDB or webSQL", function() {
		var res;

		beforeEach(function(done) {
			$localForage.setItem('myName', 'Olivier Combe').then(function(d) {
				$localForage.getItem('myName').then(function(data) {
					res = data;
					done();
				}, done);
			}, done);
		});

		it('service:setItem and getItem should work', function() {
			expect(res).toEqual('Olivier Combe');
		});
	});

	// using localstorage
	describe("localStorageWrapper", function() {
		var res;

		beforeEach(function(done) {
			$localForage.setDriver('localStorageWrapper').then(function() {
				$localForage.setItem('myName', 'Olivier Combe').then(function(d) {
					$localForage.getItem('myName').then(function(data) {
						res = data;
						done();
					}, done);
				}, done);
			}, done);
		});

		it('service:setItem and getItem should work', function() {
			expect(res).toEqual('Olivier Combe');
		});
	});

	describe("IndexedDB or webSQL", function() {
		var res;

		beforeEach(function(done) {
			$localForage.setItem('myArray', [{
				$$hashKey: '00A',
				name: 'Olivier Combe'
			}]).then(function(d) {
				$localForage.getItem('myArray').then(function(data) {
					res = data;
					done();
				}, done);
			}, done);
		});

		it('service:setItem should strip $$hashKey from arrays used in ngRepeat', function() {
			expect(res.length).toEqual(1);
			expect(res[0].name).toEqual('Olivier Combe');
		});
	});

	describe("localStorageWrapper", function() {
		var res;

		beforeEach(function(done) {
			$localForage.setDriver('localStorageWrapper').then(function() {
				$localForage.setItem('myArray', [{
					$$hashKey: '00A',
					name: 'Olivier Combe'
				}]).then(function(d) {
					$localForage.getItem('myArray').then(function(data) {
						res = data;
						done();
					}, done);
				}, done);
			}, done);
		});

		it('service:setItem should strip $$hashKey from arrays used in ngRepeat', function() {
			expect(res.length).toEqual(1);
			expect(res[0].name).toEqual('Olivier Combe');
		});
	});

	describe("service:search", function() {
		var res;

		beforeEach(function(done) {
			$localForage.setItem('myName', 'Olivier Combe').then(function() {
				$localForage.setItem('myPassion', 'AngularJs').then(function() {
					$localForage.setItem('myHobbie', 'Open Source').then(done, done);
				}, done);
			}, done);
		});

		describe("", function() {
			beforeEach(function(done) {
				$localForage.search(function(key, value) {
					return true;
				}).then(function(data) {
					res = data;
					done();
				}, done);
			});

			it('should work', function() {
				expect(res.length).toEqual(3);
			});
		});

		describe("", function() {
			beforeEach(function(done) {
				//test key filter
				$localForage.search(function(key, value) {
					return key == 'myPassion';
				}).then(function(data) {
					res = data;
					done();
				}, done);
			});

			it('key filter should work', function() {
				expect(res.length).toEqual(1);
				expect(res[0]).toBe('AngularJs');
			});
		});

		describe("", function() {
			beforeEach(function(done) {
				//test value filter
				$localForage.search(function(key, value) {
					return value == 'AngularJs';
				}).then(function(data) {
					res = data;
					done();
				}, done);
			});

			it('value filter should work', function() {
				expect(res.length).toEqual(1);
				expect(res[0]).toBe('AngularJs');
			});
		});
	});
});
