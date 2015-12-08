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

    $localForage.setItem('myName', 'Olivier Combe').then(function(data) {
      expect(data).toEqual('Olivier Combe');

      $localForage.getItem('myName').then(function(data) {
        stopDigests(interval);
        expect(data).toEqual('Olivier Combe');
        done();
      }, done);

    }, done);
  });

  it('setItem and getItem should work with an array of keys', function(done) {
    var interval = triggerDigests(),
      values = ['Olivier Combe', 'AngularJs', 'Open Source'];

    $localForage.setItem(['myName', 'myPassion', 'myHobbie'], values).then(function(data) {
      expect(data).toEqual(values);

      $localForage.getItem(['myHobbie', 'myName']).then(function(data) {
        stopDigests(interval);
        expect(data.length).toEqual(2);
        expect(data).toEqual(['Open Source', 'Olivier Combe']);
        done();
      }, done);

    }, done);
  });

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
});
