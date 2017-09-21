describe('Module: LocalForageModule, Item', function () {
  var $localForage;
  var $localForageProvider;
  var $q;
  var $rootScope;
  var $window;

  angular.module('app', ['LocalForageModule']);

  beforeEach(module('app'));

  beforeEach(module(function (_$localForageProvider_) {
    $localForageProvider = _$localForageProvider_;
  }));

  beforeEach(inject(function ($injector) {
    $localForage = $injector.get('$localForage');
    $q = $injector.get('$q');
    $rootScope = $injector.get('$rootScope');
    $window = $injector.get('$window');
  }));

  describe('#setItem', function () {
    beforeEach(function () {
      $localForageProvider.setNotify(true, false);
      spyOn($window.localforage, 'setItem').and.returnValue($q.resolve());
      spyOn($localForage, 'driver').and.returnValue('a driver');
    });

    describe('with an undefined key', function () {
      it('throws', function () {
        expect($localForage.setItem).toThrow();
      });
    });

    describe('with a string key', function () {
      testSetItem('with an undefined value', [undefined], [undefined]);

      testSetItem('with a null value', [null], [null]);

      testSetItem('with a boolean value', [true, false], [true, false]);

      testSetItem('with a string value', ['1', 'hello'], ['1', 'hello']);

      testSetItem('with a number value', [4], [4]);

      testSetItem('with an array value', [[], [1,2,3], [undefined]], [[], [1,2,3], [undefined]]);

      testSetItem('with an object value', [{}, { key: 'value' }], [{}, { key: 'value' }]);

      // Complex cases

      testSetItem(
        'it strips $promise entries from object',
        [{ $promise: 'remove me' }, { nested: { $promise: 'remove me' } }],
        [{}, { nested: {} }]
      );

      testSetItem(
        'it strips $promise entries from object in arrays',
        [[{ $promise: 'remove me' }], [[{ nested: [{ $promise: 'remove me' }] }]]],
        [[{}], [[{ nested: [{}] }]]]
      );

      testSetItem(
        'it strips $$hashKey entries from object',
        [{ $$hashKey: 'remove me' }, { nested: { $$hashKey: 'remove me' } }],
        [{}, { nested: {} }]
      );

      testSetItem(
        'it strips $$hashKey entries from object in arrays',
        [[{ $$hashKey: 'remove me' }], [[{ nested: [{ $$hashKey: 'remove me' }] }]]],
        [[{}], [[{ nested: [{}] }]]]
      );

      function testSetItem(description, inputs, expectations) {
        inputs.forEach(function (input, index) {
          describe(description, function () {
            var instance;
            var returnValue;

            beforeEach(function () {
              spyOn($rootScope, '$broadcast');
              instance = $localForage.instance();

              $localForage
                .setItem('a', input)
                .then(function (value) {
                  returnValue = value;
                });
              $rootScope.$digest();
            });

            it('broadcasts the setItem', function () {
              expect($rootScope.$broadcast.calls.allArgs()).toEqual([
                ['LocalForageModule.setItem', {
                  key: 'a',
                  newvalue: expectations[index],
                  driver: 'a driver'
                }],
              ]);
            });

            it('returns the set value', function () {
              expect(returnValue).toEqual(expectations[index]);
            });
          });
        });
      }
    });

    describe('with an array key', function () {
      describe('with a non-array value', function () {
        it('throws', function () {
          expect(function () {
            $localForage.setItem([], 'string');
          }).toThrow(Error('If you set an array of keys, the values should be an array too'));
        });
      });

      describe('with an array value', function () {
        var instance;

        beforeEach(function () {
          instance = $localForage.instance();
          spyOn(instance, 'setItem').and.callThrough();

          $localForage.setItem(['a','b','c'], [4,5,6]);
          $rootScope.$digest();
        });

        it('calls itself with each individual pair', function () {
          expect(instance.setItem.calls.allArgs()).toEqual([
            [['a', 'b', 'c'], [4, 5, 6]],
            ['a', 4],
            ['b', 5],
            ['c', 6],
          ]);
        });
      });
    });
  });

  describe('#getItem', function () {
    var localforageSpy;
    var returnValue;

    beforeEach(function () {
      localforageSpy = spyOn($window.localforage, 'getItem');
      returnValue = undefined;
    });

    describe('with an undefined key', function () {
      it('throws', function () {
        expect($localForage.getItem).toThrow(Error('You must define a key to get'));
      });
    });

    describe('with a string key', function () {
      describe('with a null value', function () {
        describe('when rejectOnNull is false', function () {
          beforeEach(function () {
            localforageSpy.and.returnValue($q.resolve(null));
            $localForage
              .getItem('a', false)
              .then(function (value) {
                returnValue = value;
              });
            $rootScope.$digest();
          });

          it('resolves with null value', function () {
            expect(returnValue).toBeNull();
          });
        });

        describe('when rejectOnNull is true', function () {
          beforeEach(function () {
            localforageSpy.and.returnValue($q.resolve(null));
            $localForage
              .getItem('a', true)
              .catch(function (value) {
                returnValue = value;
              });
            $rootScope.$digest();
          });

          it('rejects with null value', function () {
            expect(returnValue).toBeNull();
          });
        });
      });

      describe('with a non-null value', function () {
        beforeEach(function () {
          localforageSpy.and.returnValue($q.resolve(4));
          $localForage
            .getItem('a')
            .then(function (value) {
              returnValue = value;
            });
          $rootScope.$digest();
        });

        it('resolves with the value', function () {
          expect(returnValue).toBe(4);
        });
      });
    });

    describe('with an array key', function () {
      describe('with some undefined values', function () {
        var returnValue;

        beforeEach(function () {
          returnValue = undefined;

          spyOn($window.localforage, 'iterate').and.callFake(function (callback) {
            [[4, 'a'], [undefined, 'b'], [6, 'c']].forEach(function (pair) {
              callback.apply(null, pair);
              console.log(pair);
            });

            return $q.resolve([4, undefined, 6]);
          });
        });

        describe('when rejectOnNull is false', function () {
          beforeEach(function () {
            $localForage
              .getItem(['a', 'b', 'c'], false)
              .then(function (value) {
                returnValue = value;
              });
            $rootScope.$digest();
          });

          it('resolves with the found values', function () {
            expect(returnValue).toEqual([4, null, 6]);
          });
        });

        describe('when rejectOnNull is true', function () {
          beforeEach(function () {
            $localForage
              .getItem(['a', 'b', 'c'], true)
              .catch(function (value) {
                returnValue = value;
              });
            $rootScope.$digest();
          });

          it('rejects with the found values', function () {
            expect(returnValue).toEqual([4, null, 6]);
          });
        });
      });

      describe('with defined values', function () {
        var returnValue;

        beforeEach(function () {
          returnValue = undefined;

          spyOn($window.localforage, 'iterate').and.callFake(function (callback) {
            [[4, 'a'], [5, 'b'], [6, 'c']].forEach(function (pair) {
              callback.apply(null, pair);
              console.log(pair);
            });

            return $q.resolve([4, undefined, 6]);
          });
          $localForage
            .getItem(['a', 'b', 'c'], false)
            .then(function (value) {
              returnValue = value;
            });
          $rootScope.$digest();
        });

        it('resolves with the found values', function () {
          expect(returnValue).toEqual([4, 5, 6]);
        });
      });
    });
  });

  describe('#iterate', function () {
    beforeEach(function () {
      spyOn($window.localforage, 'iterate').and.callFake(function (callback) {
        callback('value', 'key', 'iterationNumber');
        return $q.resolve();
      });
    });

    describe('with an undefined callback', function () {
      it('throws', function () {
        expect($localForage.iterate).toThrow(Error('You must define a callback to iterate'));
      });
    });

    describe('with a callback', function () {
      var callbackSpy;

      beforeEach(function () {
        callbackSpy = jasmine.createSpy('iterateCallback');
        $localForage.iterate(callbackSpy);
        $rootScope.$digest();
      });

      it('calls the callback', function () {
        expect(callbackSpy).toHaveBeenCalledWith('value', 'key', 'iterationNumber');
      });
    });
  });

  describe('#removeItem', function () {
    var removeItemSpy;

    beforeEach(function () {
      spyOn($rootScope, '$broadcast');
      removeItemSpy = spyOn($window.localforage, 'removeItem');
    });

    describe('with an undefined key', function () {
      it('throws', function () {
        expect($localForage.removeItem).toThrow(Error('You must define a key to remove'));
      });
    });

    describe('with a string key', function () {
      describe('with a successful removal', function () {
        var resolved;

        beforeEach(function () {
          removeItemSpy.and.returnValue($q.resolve());
          resolved = false;
          spyOn($localForage, 'driver').and.returnValue('a driver');
          $localForageProvider.setNotify(false, true);

          $localForage
            .removeItem('a')
            .then(function () {
              resolved = true;
            });
          $rootScope.$digest();
        });

        it('broadcasts the removeItem event', function () {
          expect($rootScope.$broadcast).toHaveBeenCalledWith(
            'LocalForageModule.removeItem',
            { key: 'a', driver: 'a driver' }
          );
        });

        it('resolves successfully', function () {
          expect(resolved).toBe(true);
        });
      });

      describe('with an error on removal', function () {
        var rejected;

        beforeEach(function () {
          rejected = false;
          removeItemSpy.and.returnValue($q.reject());
          spyOn($localForage, 'driver').and.returnValue('a driver');
          $localForageProvider.setNotify(false, true);

          $localForage
            .removeItem('a')
            .catch(function () {
              rejected = false;
            });
          $rootScope.$digest();
        });

        it('does not broadcasts the removeItem event', function () {
          expect($rootScope.$broadcast).not.toHaveBeenCalledWith(
            'LocalForageModule.removeItem',
            { key: 'a', driver: 'a driver' }
          );
        });

        it('rejects', function () {
          expect(rejected).toBe(false);
        });
      });
    });

    describe('with an array key', function () {
      beforeEach(function () {
        removeItemSpy.and.returnValue($q.resolve());
        $localForage.removeItem(['a', 'b', 'c']);
        $rootScope.$digest();
      });

      it('invokes the localforage#removeItem method for each key', function () {
        expect($window.localforage.removeItem.calls.allArgs()).toEqual([
          ['a'],
          ['b'],
          ['c'],
        ]);
      });
    });
  });

  describe('#pull', function () {
    describe('with an undefined key', function () {
      it('throws', function () {
        expect($localForage.pull).toThrow(Error('You must define a key to pull'));
      });
    });

    describe('with a string key', function () {
      var item = {};
      var returnValue;

      beforeEach(function () {
        returnValue = false;
      });

      describe('with successful #getItem', function () {
        beforeEach(function () {
          spyOn($localForage, 'getItem').and.returnValue($q.resolve(item));
        });

        describe('with successful #removeItem', function () {
          beforeEach(function () {
            spyOn($localForage, 'removeItem').and.returnValue($q.resolve());

            $localForage
              .pull('a')
              .then(function (value) {
                returnValue = value;
              });
            $rootScope.$digest();
          });

          it('calls #getItem with the key', function () {
            expect($localForage.getItem).toHaveBeenCalledWith('a');
          });

          it('calls #removeItem with the key', function () {
            expect($localForage.removeItem).toHaveBeenCalledWith('a');
          });

          it('returns the value returned from getItem', function () {
            expect(returnValue).toBe(item);
          });
        });

        describe('with error on #removeItem', function () {
          beforeEach(function () {
            spyOn($localForage, 'removeItem').and.returnValue($q.reject(new Error('removeItem error')));

            $localForage
              .pull('a')
              .catch(function (value) {
                returnValue = value;
              });
            $rootScope.$digest();
          });

          it('calls #getItem with the key', function () {
            expect($localForage.getItem).toHaveBeenCalledWith('a');
          });

          it('calls #removeItem with the key', function () {
            expect($localForage.removeItem).toHaveBeenCalledWith('a');
          });

          it('rejects with the error', function () {
            expect(returnValue).toEqual(Error('removeItem error'));
          });
        });
      });

      describe('with error on getItem', function () {
        beforeEach(function () {
          spyOn($localForage, 'getItem').and.returnValue($q.reject(new Error('getItem error')));
        });

        describe('with successful #removeItem', function () {
          beforeEach(function () {
            spyOn($localForage, 'removeItem');

            $localForage
              .pull('a')
              .catch(function (value) {
                returnValue = value;
              });
            $rootScope.$digest();
          });

          it('calls #getItem with the key', function () {
            expect($localForage.getItem).toHaveBeenCalledWith('a');
          });

          it('does not call #removeItem with the key', function () {
            expect($localForage.removeItem).not.toHaveBeenCalled();
          });

          it('rejects with the error', function () {
            expect(returnValue).toEqual(Error('getItem error'));
          });
        });
      });
    });
  });

  describe('#clear', function () {
    var resolved;
    var rejected;
    var clearSpy;

    beforeEach(function () {
      resolved = false;
      rejected = false;
      clearSpy = spyOn($window.localforage, 'clear');
    });

    describe('when successfully clearing', function () {
      beforeEach(function () {
        clearSpy.and.returnValue($q.resolve());

        $localForage
          .clear()
          .then(function () {
            resolved = true;
          })
          .catch(function () {
            rejected = true;
          });
        $rootScope.$digest();
      });

      it('calls localforage.clear', function () {
        expect($window.localforage.clear).toHaveBeenCalled();
      });

      it('resolves', function () {
        expect(resolved).toBe(true);
      });

      it('does not reject', function () {
        expect(rejected).toBe(false);
      });
    });

    describe('with an error clearing', function () {
      beforeEach(function () {
        clearSpy.and.returnValue($q.reject());

        $localForage
          .clear()
          .then(function () {
            resolved = true;
          })
          .catch(function () {
            rejected = true;
          });
        $rootScope.$digest();
      });

      it('calls localforage.clear', function () {
        expect($window.localforage.clear).toHaveBeenCalled();
      });

      it('rejects', function () {
        expect(rejected).toBe(true);
      });

      it('does not resolve', function () {
        expect(resolved).toBe(false);
      });
    });
  });

  describe('#key', function () {
    var returnValue;
    var lookupSpy;

    beforeEach(function () {
      returnValue = undefined;
      lookupSpy = spyOn($window.localforage, 'key');
    });

    describe('with an undefined index', function () {
      it('throws', function () {
        expect($localForage.key).toThrow(Error('You must define a position to get for the key function'));
      });
    });

    describe('when lookup rejects', function () {
      beforeEach(function () {
        lookupSpy.and.returnValue($q.reject(Error('a lookup error')));
        $localForage
          .key(0)
          .catch(function (value) {
            returnValue = value;
          });
        $rootScope.$digest();
      });

      it('rejects with the error', function () {
        expect(returnValue).toEqual(Error('a lookup error'));
      });
    });

    describe('when lookup resolves with null', function () {
      beforeEach(function () {
        lookupSpy.and.returnValue($q.resolve(null));
        $localForage
          .key(0)
          .then(function (value) {
            returnValue = value;
          });
        $rootScope.$digest();
      });

      it('resolves with null', function () {
        expect(returnValue).toBe(null);
      });
    });

    describe('when the lookup resolves with a string', function () {
      beforeEach(function () {
        lookupSpy.and.returnValue($q.resolve('a key'));
        $localForage
          .key(0)
          .then(function (value) {
            returnValue = value;
          });
        $rootScope.$digest();
      });

      it('resolves with that string', function () {
        expect(returnValue).toBe('a key');
      });
    });
  });

  describe('#keys', function () {
    var returnValue;
    var keysSpy;

    beforeEach(function () {
      returnValue = undefined;
      keysSpy = spyOn($window.localforage, 'keys');
    });

    describe('with an error', function () {
      beforeEach(function () {
        keysSpy.and.returnValue($q.reject(Error('a keys error')));
        $localForage
          .keys()
          .catch(function (value) {
            returnValue = value;
          });
        $rootScope.$digest();
      });

      it('rejects with the error', function () {
        expect(returnValue).toEqual(Error('a keys error'));
      });
    });

    describe('when using localStorageWrapper with an oldPrefix', function () {
      beforeEach(function () {
        $localForageProvider.config({ oldPrefix: 'lf' });
        spyOn($window.localforage, 'driver').and.returnValue('localStorageWrapper');
        spyOn($localForage, 'prefix').and.returnValue('lf');
        keysSpy.and.returnValue($q.resolve(['lfkey', 'lfanotherOne']));
        $localForage
          .keys()
          .then(function (value) {
            returnValue = value;
          });
        $rootScope.$digest();
      });

      it('resolves with the list of keys', function () {
        expect(returnValue).toEqual(['key', 'anotherOne']);
      });
    });

    describe('when using a non-localStorageWrapper driver', function () {
      beforeEach(function () {
        spyOn($window.localforage, 'driver').and.returnValue('a driver');
        keysSpy.and.returnValue($q.resolve(['key', 'anotherOne']));
        $localForage
          .keys()
          .then(function (value) {
            returnValue = value;
          });
        $rootScope.$digest();
      });

      it('resolves with the list of keys', function () {
        expect(returnValue).toEqual(['key', 'anotherOne']);
      });
    });
  });

  describe('#length', function () {
    var returnValue;
    var lengthSpy;

    beforeEach(function () {
      returnValue = undefined;
      lengthSpy = spyOn($window.localforage, 'length');
    });

    describe('when lookup rejects with an error', function () {
      beforeEach(function () {
        lengthSpy.and.returnValue($q.reject(Error('a length error')));
        $localForage
          .length()
          .catch(function (value) {
            returnValue = value;
          });
        $rootScope.$digest();
      });

      it('rejects with the error', function () {
        expect(returnValue).toEqual(Error('a length error'));
      });
    });

    describe('when lookup returns a number', function () {
      beforeEach(function () {
        lengthSpy.and.returnValue($q.resolve(1));
        $localForage
          .length()
          .then(function (value) {
            returnValue = value;
          });
        $rootScope.$digest();
      });

      it('resolves with the number', function () {
        expect(returnValue).toBe(1);
      });
    });
  });
});
