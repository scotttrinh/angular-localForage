/*globals describe, beforeEach, afterEach, inject, module, it, expect, angular */

describe('Module: LocalForageModule', function() {
  'use strict';

  var $rootScope,
    $localForage,
    instanceVersion = 0,
    triggerDigests = function() {
      return setInterval(function() {
        $rootScope.$digest();
      }, 10)
    };

  angular.module('app', ['LocalForageModule']);

  beforeEach(function() {
    module('app');
    inject(function(_$rootScope_, _$localForage_) {
      $rootScope = _$rootScope_;
      $localForage = _$localForage_;
    })
  });

  afterEach(function(done) {
    var interval = triggerDigests();
    // create a fresh instance
    $localForage.clear().then(function() {
      $localForage = $localForage.createInstance({
        name: ++instanceVersion
      });
      window.clearInterval(interval);
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

  it('service:iterate should be defined', function() {
    expect($localForage.iterate).toBeDefined();
    expect(typeof $localForage.iterate).toBe('function');
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
  it('service:setItem and getItem with IndexedDB or webSQL should work', function(done) {
    var interval = triggerDigests();

    $localForage.setItem('myName', 'Olivier Combe').then(function(d) {

      $localForage.getItem('myName').then(function(data) {
        window.clearInterval(interval);
        expect(data).toEqual('Olivier Combe');
        done();
      }, done);
      
    }, done);
  });

  // using localstorage
  it('service:setItem and getItem with localStorageWrapper should work', function(done) {
    var interval = triggerDigests();

    $localForage.setDriver('localStorageWrapper').then(function() {
      $localForage.setItem('myName', 'Olivier Combe').then(function(d) {
        $localForage.getItem('myName').then(function(data) {
          window.clearInterval(interval);
          expect(data).toEqual('Olivier Combe');
          done();
        }, done);
      }, done);
    }, done);
  });

  it('service:setItem with IndexedDB or webSQL should strip $$hashKey from arrays used in ngRepeat', function(done) {
    var interval = triggerDigests();

    $localForage.setItem('myArray', [{
      $$hashKey: '00A',
      name: 'Olivier Combe'
    }]).then(function(d) {

      $localForage.getItem('myArray').then(function(data) {
        window.clearInterval(interval);
        expect(data.length).toEqual(1);
        expect(data[0].name).toEqual('Olivier Combe');
        done();
      }, done);

    }, done);
  });

  it('service:setItem with localStorageWrapper should strip $$hashKey from arrays used in ngRepeat', function(done) {
    var interval = triggerDigests();

    $localForage.setDriver('localStorageWrapper').then(function() {
      $localForage.setItem('myArray', [{
        $$hashKey: '00A',
        name: 'Olivier Combe'
      }]).then(function(d) {

        $localForage.getItem('myArray').then(function(data) {
          window.clearInterval(interval);
          expect(data.length).toEqual(1);
          expect(data[0].name).toEqual('Olivier Combe');
          done();
        }, done);

      }, done);
    }, done);
  });

  describe("service:iterate", function() {
    var interval;

    beforeEach(function(done) {
      interval = triggerDigests();
      $localForage.setItem('myName', 'Olivier Combe').then(function() {
        $localForage.setItem('myPassion', 'AngularJs').then(function() {
          $localForage.setItem('myHobbie', 'Open Source').then(done, done);
        }, done);
      }, done);
    });

    describe("", function() {
      it('should work', function(done) {
        var res = [];

        $localForage.iterate(function(value, key) {
          res.push(key);
        }).then(function(data) {
          window.clearInterval(interval);
          expect(res.length).toEqual(3);
          done();
        }, done);
      });
    });

    describe("", function() {
      it('key/value filter should work', function(done) {
        //test key filter
        $localForage.iterate(function(value, key) {
          if(key == 'myPassion') {
            return value;
          }
        }).then(function(data) {
          window.clearInterval(interval);
          expect(data).toEqual('AngularJs');
          done();
        }, done);
      });
    });
  });
});
