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
    },
    stopDigests = function(interval) {
      window.clearInterval(interval);
    };

  angular.module('app', ['LocalForageModule']);

  beforeEach(function() {
    module('app');
    inject(function(_$rootScope_, _$localForage_) {
      $rootScope = _$rootScope_;
      $localForage = _$localForage_;
    });
  });

  afterEach(function(done) {
    var interval = triggerDigests();
    // create a fresh instance
    $localForage.clear().then(function() {
      $localForage = $localForage.createInstance({
        name: ++instanceVersion
      });
      stopDigests(interval);
      done();
    }, done);
  });

  it('service should be defined', function() {
    expect($localForage).toBeDefined();
  });

  it('setDriver should be defined', function() {
    expect($localForage.setDriver).toBeDefined();
    expect(typeof $localForage.setDriver).toBe('function');
  });

  it('driver should be defined', function() {
    expect($localForage.driver).toBeDefined();
    expect(typeof $localForage.driver).toBe('function');
  });

  it('defineDriver should be defined', function() {
    expect($localForage.defineDriver).toBeDefined();
    expect(typeof $localForage.defineDriver).toBe('function');
  });

  it('setItem should be defined', function() {
    expect($localForage.setItem).toBeDefined();
    expect(typeof $localForage.setItem).toBe('function');
  });

  it('getItem should be defined', function() {
    expect($localForage.getItem).toBeDefined();
    expect(typeof $localForage.getItem).toBe('function');
  });

  it('getItem produces null value for unknown key', function(done) {
    var interval = triggerDigests();

    $localForage.getItem('this key is unknown').then(function(value) {
      stopDigests(interval);
      expect(value).toBeNull();
      done();
    }, done);
  });

  it('getItem produces a rejected promise for unknown key if second parameter is true', function(done) {
    var interval = triggerDigests();

    $localForage.getItem('this key is unknown', true)
      .catch(function(err) {
        stopDigests(interval);
        expect(err).toBe(null);
        done();
      });
  })

  describe('getItem for an array with unknown keys', function() {
    it('should produce null values with all unknown keys', function(done) {
      var interval = triggerDigests();

      $localForage.getItem(['unknown key 1', 'unknown key 2']).then(function(values) {
        stopDigests(interval);
        expect(values).toEqual([null, null]);
        done()
      }, done)
    });

    it('should produce null value for an unknown trailing key', function(done) {
      var interval = triggerDigests();

      $localForage.setItem('known key', 'known value').then(function() {
        $localForage.getItem(['known key', 'unknown key']).then(function(values) {
          stopDigests(interval);
          expect(values).toEqual(['known value', null]);
          done()
        }, done)
      });
    });

    it('should produce null value for an unknown initial key', function(done) {
      var interval = triggerDigests();

      $localForage.setItem('known key', 'known value').then(function() {
        $localForage.getItem(['unknown key', 'known key']).then(function(values) {
          stopDigests(interval);
          expect(values).toEqual([null, 'known value']);
          done()
        }, done)
      });
    });

    it('should produce null value for a unknown middle key', function(done) {
      var interval = triggerDigests();

      $localForage.setItem(['known key', 'known key 2'], ['known value', 'known value 2']).then(function() {
        $localForage.getItem(['known key', 'unknown key', 'known key 2']).then(function(values) {
          stopDigests(interval);
          expect(values).toEqual(['known value', null, 'known value 2']);
          done()
        }, done)
      });
    });
  });

  describe("iterate", function() {
    var interval;

    beforeEach(function(done) {
      interval = triggerDigests();
      $localForage.setItem(['myName', 'myPassion', 'myHobbie'], ['Olivier Combe', 'AngularJs', 'Open Source']).then(done, done);
    });

    it('should work', function(done) {
      var res = [];

      $localForage.iterate(function(value, key) {
        res.push(key);
      }).then(function() {
        stopDigests(interval);
        expect(res.length).toEqual(3);
        done();
      }, done);
    });

    it('should have an iterationNumber with a 1-index', function(done) {
      var count;

      $localForage.iterate(function(value, key, iterationNumber) {
        count = iterationNumber;
      }).then(function() {
        stopDigests(interval);
        expect(count).toEqual(3);
        done();
      }, done);
    })

    it('key/value filter should work', function(done) {
      //test key filter
      $localForage.iterate(function(value, key) {
        if(key == 'myPassion') {
          return value;
        }
      }).then(function(data) {
        stopDigests(interval);
        expect(data).toEqual('AngularJs');
        done();
      }, done);
    });
  });

  it('setItem and getItem should work', function(done) {
    var interval = triggerDigests();
    var timestamp = new Date();
    var objectToStore = {
      $$hashKey: 'object:1',
      name: 'Scott Trinh',
      date: timestamp
    };

    spyOn($localForage._localforage, 'setItem').and.callThrough();

    $localForage.setItem('myObject', objectToStore).then(function(data) {
      expect(data).toEqual({ name: 'Scott Trinh', date: timestamp });
      expect($localForage._localforage.setItem.calls.mostRecent().args[1]).toEqual({ name: 'Scott Trinh', date: timestamp});

      $localForage.getItem('myObject').then(function(data) {
        stopDigests(interval);
        expect(data).toEqual({ name: 'Scott Trinh', date: timestamp });
        done();
      }, done);

    }, done);
  });

  it('setItem and getItem should work for a Date object', function(done) {
    var interval = triggerDigests();
    var timestamp = new Date();

    spyOn($localForage._localforage, 'setItem').and.callThrough();

    $localForage.setItem('myDateObject', timestamp).then(function(data) {
      expect(data).toEqual(timestamp);
      expect($localForage._localforage.setItem.calls.mostRecent().args[1]).toEqual(timestamp);

      $localForage.getItem('myDateObject').then(function(data) {
        stopDigests(interval);
        expect(data).toEqual(timestamp);
        done();
      }, done);

    }, done);
  });

  it('setItem should remove $$hashKey from nested arrays', function () {
    var arrayToStore = [
      {
        collection: [
          { $$hashKey: 'object:1' },
          { $$hashKey: 'object:2' }
        ],
        deeperCollection: {
          collection: [
            { $$hashKey: 'object:3' },
            { $$hashKey: 'object:4' }
          ]
        }
      }
    ];

    $localForage.setItem('myArray', arrayToStore).then(function (data) {
      expect(data).toEqual([
        {
          collection: [{}, {}],
          deeperCollection: {
            collection: [{}, {}]
          }
        }
      ]);
      expect(arrayToStore).toEqual([
        {
          collection: [
            { $$hashKey: 'object:1' },
            { $$hashKey: 'object:2' }
          ],
          deeperCollection: {
            collection: [
              { $$hashKey: 'object:3' },
              { $$hashKey: 'object:4' }
            ]
          }
        }
      ]);
    });
  });

  it('setItem works with arrays of non-objects, and strips the $$hashKey of any object', function () {
    var arrayToStore = [
      [[]],
      [{}, {$$hashKey: 'object:1'}],
      'string',
      true,
      false,
      null,
      undefined,
      {},
    ];

    $localForage.setItem('myWeirdArray', arrayToStore).then(function (data) {
      expect(data).toEqual([
        [[]],
        [{}, {}],
        'string',
        true,
        false,
        null,
        undefined,
        {},
      ]);
      expect(arrayToStore).toEqual([
        [[]],
        [{}, {$$hashKey: 'object:1'}],
        'string',
        true,
        false,
        null,
        undefined,
        {},
      ]);
    });
  });

  it('setItem error should reject promise', function(done) {
    var interval = triggerDigests();

    spyOn($localForage._localforage, 'setItem').and.callFake(function() {
      return Promise.reject('Somebody set up us the bomb.')
    });

    $localForage.setItem('myError', 'please work!').then(done).catch(function withError(error) {
      expect(error).toEqual('Somebody set up us the bomb.');
      done();
    });
  });

  it('setItem and getItem should work with an array of keys', function(done) {
    var interval = triggerDigests(),
      values = ['Olivier Combe', 'AngularJs', 'Open Source'];

    $localForage.setItem(['myName', 'myPassion', 'myHobbie'], values).then(function(data) {
      expect(data).toEqual(values);

      $localForage.getItem(['myHobbie', 'myName', 'notInDatabase']).then(function(data) {
        stopDigests(interval);
        expect(data.length).toEqual(3);
        expect(data).toEqual(['Open Source', 'Olivier Combe', null]);
        done();
      }, done);

    }, done);
  });

  it('getItem should reject if one of the values is null if true is passed as the second argument', function(done) {
    var interval = triggerDigests();

    $localForage.setItem(['myName', 'myPassion'], ['Scott Trinh', 'Anarchy']).then(function(data) {
      $localForage.getItem(['myPassion', 'myName', 'notInDatabase'], true).catch(function(data) {
        stopDigests(interval);
        expect(data.length).toEqual(3);
        expect(data).toEqual(['Anarchy', 'Scott Trinh', null]);
        done();
      });
    });

  })

  it('iterate should be defined', function() {
    expect($localForage.iterate).toBeDefined();
    expect(typeof $localForage.iterate).toBe('function');
  });

  describe('removeItem', function() {
    var interval;

    beforeEach(function(done) {
      interval = triggerDigests();
      $localForage.setItem(['myName', 'myPassion', 'myHobbie'], ['Olivier Combe', 'AngularJs', 'Open Source']).then(done, done);
    });

    it('should be defined', function() {
      expect($localForage.removeItem).toBeDefined();
      expect(typeof $localForage.removeItem).toBe('function');
      stopDigests(interval);
    });

    it('should work', function(done) {
      $localForage.removeItem('myName').then(function() {

        $localForage.getItem('myName').then(function(data) {
          stopDigests(interval);
          expect(data).toBeNull();
          done();
        }, done);

      }, done);
    });

    it('should work with an array of keys', function(done) {
      $localForage.removeItem(['myName', 'myPassion']).then(function() {

        $localForage.getItem(['myName', 'myPassion', 'myHobbie']).then(function(data) {
          stopDigests(interval);
          expect(data[0]).toBeNull();
          expect(data[1]).toBeNull();
          expect(data[2]).toEqual('Open Source');
          done();
        }, done);

      }, done);
    });
  });

  describe('pull', function() {
    var interval;

    beforeEach(function(done) {
      interval = triggerDigests();
      $localForage.setItem(['myName', 'myPassion', 'myHobbie'], ['Olivier Combe', 'AngularJs', 'Open Source']).then(done, done);
    });

    it('should be defined', function() {
      expect($localForage.pull).toBeDefined();
      expect(typeof $localForage.pull).toBe('function');
      stopDigests(interval);
    });

    it('should work', function(done) {
      $localForage.pull('myName').then(function(data) {
        expect(data).toEqual('Olivier Combe');

        $localForage.getItem('myName').then(function(data) {
          stopDigests(interval);
          expect(data).toBeNull();
          done();
        }, done);

      }, done);
    });

    it('should work with an array of keys', function(done) {
      $localForage.pull(['myName', 'myPassion']).then(function(data) {
        expect(data).toEqual(['Olivier Combe', 'AngularJs']);

        $localForage.getItem(['myName', 'myPassion', 'myHobbie']).then(function(data) {
          stopDigests(interval);
          expect(data[0]).toBeNull();
          expect(data[1]).toBeNull();
          expect(data[2]).toEqual('Open Source');
          done();
        }, done);

      }, done);
    });
  });

  it('clear should be defined', function() {
    expect($localForage.clear).toBeDefined();
    expect(typeof $localForage.clear).toBe('function');
  });

  it('clear should works', function() {
    //todo
  });

  it('key should be defined', function() {
    expect($localForage.key).toBeDefined();
    expect(typeof $localForage.key).toBe('function');
  });

  it('keys should be defined', function() {
    expect($localForage.keys).toBeDefined();
    expect(typeof $localForage.keys).toBe('function');
  });

  it('length should be defined', function() {
    expect($localForage.length).toBeDefined();
    expect(typeof $localForage.length).toBe('function');
  });

  it('bind should be defined', function() {
    expect($localForage.bind).toBeDefined();
    expect(typeof $localForage.bind).toBe('function');
  });

  it('unbind should be defined', function() {
    expect($localForage.unbind).toBeDefined();
    expect(typeof $localForage.unbind).toBe('function');
  });

  it('directive should be defined', function() {
    // todo
  });

  // using default driver
  it('setItem and getItem with IndexedDB or webSQL should work', function(done) {
    var interval = triggerDigests();

    $localForage.setItem('myName', 'Olivier Combe').then(function(d) {

      $localForage.getItem('myName').then(function(data) {
        stopDigests(interval);
        expect(data).toEqual('Olivier Combe');
        done();
      }, done);

    }, done);
  });

  // using localstorage
  it('setItem and getItem with localStorageWrapper should work', function(done) {
    var interval = triggerDigests();

    $localForage.setDriver('localStorageWrapper').then(function() {
      $localForage.setItem('myName', 'Olivier Combe').then(function(d) {
        $localForage.getItem('myName').then(function(data) {
          stopDigests(interval);
          expect(data).toEqual('Olivier Combe');
          done();
        }, done);
      }, done);
    }, done);
  });

  it('setItem with IndexedDB or webSQL should strip $$hashKey from arrays used in ngRepeat', function(done) {
    var interval = triggerDigests();

    $localForage.setItem('myArray', [{
      $$hashKey: '00A',
      name: 'Olivier Combe'
    }]).then(function() {
      $localForage.getItem('myArray').then(function(data) {
        stopDigests(interval);
        expect(data.length).toEqual(1);
        expect(data[0].name).toEqual('Olivier Combe');
        done();
      }, done);
    }, done);
  });

  it('setItem with localStorageWrapper should strip $$hashKey from arrays used in ngRepeat', function(done) {
    var interval = triggerDigests();

    $localForage.setDriver('localStorageWrapper').then(function() {
      $localForage.setItem('myArray', [{
        $$hashKey: '00A',
        name: 'Olivier Combe'
      }]).then(function() {
        $localForage.getItem('myArray').then(function(data) {
          stopDigests(interval);
          expect(data.length).toEqual(1);
          expect(data[0].name).toEqual('Olivier Combe');
          done();
        }, done);

      }, done);
    }, done);
  });

  it('setItem should be able to store a Blob', function(done) {
    if(typeof Blob !== 'undefined') {
      var interval = triggerDigests();

      var aFileParts = ["<a id=\"a\"><b id=\"b\">hey!<\/b><\/a>"];
      var oMyBlob = new Blob(aFileParts, {"type": "text\/xml"}); // the blob

      $localForage.setItem('myBlob', oMyBlob).then(function(data) {
        stopDigests(interval);
        expect(data instanceof Blob).toBe(true);
        done();
      }, done);
    } else {
      done();
    }
  });

  it(" setItem should throw an error if keys are an array but values aren't", function() {
    expect(function() {
      $localForage.setItem(['myName', 'myPassion', 'myHobbie'], 'value');
    }).toThrowError('If you set an array of keys, the values should be an array too');
  });

  it(" setItem should throw an error if key is undefined", function() {
    expect(function() {
      $localForage.setItem();
    }).toThrowError('You must define a key to set');
  });

  it('setItem should remove $promise if present', function (done) {
    var interval = triggerDigests();
    var objectToStore = {
      $promise: {},
      childObject: {}
    };
    var objectNoPromise = {
      noPromise: {}
    };
    spyOn($localForage._localforage, 'setItem').and.callThrough();

    $localForage.setItem(['myObject', 'noPromise'], [objectToStore, objectNoPromise]).then(function() {
      var setWith = $localForage._localforage.setItem.calls.argsFor(0)[1];
      var setWithNoPromise = $localForage._localforage.setItem.calls.argsFor(1)[1];
      expect(setWith).not.toBe(objectToStore);
      expect(setWith.childObject).not.toBe(objectToStore.childObject);
      expect(setWith.childObject).toEqual(objectToStore.childObject);
      expect(setWith).toEqual({
        childObject: {}
      });
      expect(objectToStore).toEqual({
        $promise: {},
        childObject: {}
      });

      expect(setWithNoPromise).toEqual(objectNoPromise);

      $localForage.getItem('myObject').then(function(data) {
        stopDigests(interval);
        expect(Object.keys(data).length).toBe(1);
        expect(data).toEqual({
          childObject: {}
        });
        done();
      }, done);
    }, done);
  })

  describe("bind", function() {
    var $scope, $q;

    beforeEach(inject(function($rootScope, _$q_){
      $scope = $rootScope;
      $q = _$q_;
    }));

    it(' should use the default stored value if nothing has been previously stored', function(done){
      var interval = triggerDigests();
      // Check different types of items.
      var testItems = [ { foo: 'bar' }, ["cat", "dog", "pidgeon"], 123, 0, true, false ];
      var promises = [];
      // Store all the items, deleting old values
      for(var i = 0; i < testItems.length; i++){
        $localForage.removeItem('item' + i);
        var item = testItems[i];
        promises.push(
          $localForage.bind($scope, {
            key: 'item' + i,
            defaultValue: item
          })
        );
      }
      // After all promises have been resolved, check the items are what we expect them to be.
      $q.all(promises).then(function(){
        stopDigests(interval);
        for(var i = 0; i < testItems.length; i++){
          expect($scope['item' + i]).toBe(testItems[i]);
        }
        done();
      }, done);
    });
  });

  describe("createInstance", function () {
    beforeEach(function () {
      $localForage.createInstance({
        name: 'DUPLICATE_INSTANCE_NAME'
      });
    });
    it('should create a new instance', function () {
      expect($localForage.createInstance({
        name: 'TEST_INSTANCE'
      })).toBeDefined();
    });

    it('should throw error if trying to create duplicate instance.',
       function () {
      expect($localForage.createInstance.bind($localForage, {
        name: 'DUPLICATE_INSTANCE_NAME'
      })).toThrowError(/already defined/);
    });

    it('should create instance with same name, different storeName',
       function () {
      expect($localForage.createInstance.bind($localForage, {
        name: 'DUPLICATE_INSTANCE_NAME',
        storeName: 'DIFFERENT_STORE_NAME'
      })).not.toThrowError(/already defined/);
    });
  });

  describe("instance", function () {
    beforeEach(function () {
      $localForage.createInstance({
        name: 'TEST_INSTANCE_1'
      });
      $localForage.createInstance({
        name: 'TEST_INSTANCE_2',
        storeName: 'TEST_STORE_NAME_1'
      });
      $localForage.createInstance({
        name: 'TEST_INSTANCE_2',
        storeName: 'TEST_STORE_NAME_2'
      });
    });

    it('should get instance by name', function () {
      expect($localForage.instance({
        name: 'TEST_INSTANCE_1'
      })).toBeDefined();
    });

    it('should throw exception if instance not exists', function () {
      expect($localForage.instance.bind($localForage, {
        name: 'NON_EXISTENT'
      })).toThrowError();
    });

    it('should get instances with same name, different storeNames',
       function () {
         var instance1 = $localForage.instance({
           name: 'TEST_INSTANCE_2',
           storeName: 'TEST_STORE_NAME_1'
         });
         var instance2 = $localForage.instance({
           name: 'TEST_INSTANCE_2',
           storeName: 'TEST_STORE_NAME_2'
         });
         expect(instance1).not.toBe(instance2);
       }
    );
  });
});
