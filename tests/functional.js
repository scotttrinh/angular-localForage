describe('Module: LocalForageModule, Functional', function () {
  var $localForage;
  var $localForageProvider;
  var $rootScope;
  var $timeout;
  var $q;
  var instanceVersion = 0;
  var promise;
  var interval;

  angular.module('app', ['LocalForageModule']);

  beforeEach(module('app'));

  beforeEach(module(function (_$localForageProvider_) {
    $localForageProvider = _$localForageProvider_;
  }));

  beforeEach(inject(function (_$localForage_, _$rootScope_, _$timeout_, _$q_) {
    $localForage = _$localForage_;
    $rootScope = _$rootScope_;
    interval = startDigest();
    $timeout = _$timeout_;
    $q = _$q_;
  }));

  afterEach(function (done) {
    $localForage
      .clear()
      .then(function () {
        $localForage = $localForage.createInstance({
          name: ++instanceVersion
        });
        window.clearInterval(interval);
        return;
      })
      .then(done)
      .catch(done);
  });

  describe('setting and retrieving an item', function () {
    testSetGetItem('with an undefined value', [undefined], [null]);

    testSetGetItem('with a null value', [null], [null]);

    testSetGetItem('with a boolean value', [true, false], [true, false]);

    testSetGetItem('with a string value', ['1', 'hello'], ['1', 'hello']);

    testSetGetItem('with a number value', [4], [4]);

    testSetGetItem('with an array value', [[], [1,2,3], [undefined]], [[], [1,2,3], [undefined]]);

    testSetGetItem('with an object value', [{}, { key: 'value' }], [{}, { key: 'value' }]);

    var now = new Date();

    testSetGetItem('with a date value', [now], [now]);

    var blob = new Blob([]);

    testSetGetItem('with a blob value', [blob], [blob]);

    // Complex cases

    testSetGetItem(
      'it strips $promise entries from object',
      [{ $promise: 'remove me' }, { nested: { $promise: 'remove me' } }],
      [{}, { nested: {} }]
    );

    testSetGetItem(
      'it strips $promise entries from object in arrays',
      [[{ $promise: 'remove me' }], [[{ nested: [{ $promise: 'remove me' }] }]]],
      [[{}], [[{ nested: [{}] }]]]
    );

    testSetGetItem(
      'it strips $$hashKey entries from object',
      [{ $$hashKey: 'remove me' }, { nested: { $$hashKey: 'remove me' } }],
      [{}, { nested: {} }]
    );

    testSetGetItem(
      'it strips $$hashKey entries from object in arrays',
      [[{ $$hashKey: 'remove me' }], [[{ nested: [{ $$hashKey: 'remove me' }] }]]],
      [[{}], [[{ nested: [{}] }]]]
    );

    function testSetGetItem(description, inputs, expectations) {
      inputs.forEach(function (input, index) {
        describe(description, function () {
          var promise;

          beforeEach(function () {
            promise = $localForage
              .setItem('key', input)
              .then(function () {
                return $localForage.getItem('key');
              });
          });

          it('has the expected value', function (done) {
            promise
              .then(function (resolved) {
                expect(resolved).toEqual(expectations[index]);
              })
              .then(done, done);
          });
        });
      });
    }
  });

  describe('retrieving an unknown key', function () {
    var promise;

    describe('when getItem has a false-y rejectOnNull argument', function () {
      beforeEach(function () {
        promise = $localForage.getItem('key', false);
      });

      it('resolves with null', function (done) {
        promise
          .then(function (resolved) {
            expect(resolved).toBe(null);
          })
          .then(done, done);
      });
    });

    describe('when getItem has a true rejectOnNull argument', function () {
      beforeEach(function () {
        promise = $localForage.getItem('key', true);
      });

      it('rejects with null', function (done) {
        promise
          .catch(function (rejected) {
            expect(rejected).toBe(null);
          })
          .then(done, done);
      });
    });

    describe('with an array of keys', function () {
      describe('when the first key is unknown', function () {
        beforeEach(function () {
          promise = $localForage
            .setItem(['second', 'third'], ['2nd', '3rd'])
            .then(function () {
              return $localForage.getItem(['first', 'second', 'third']);
            });
        });

        it('returns the array with the first item null', function (done) {
          promise
            .then(function (resolved) {
              expect(resolved).toEqual([null, '2nd', '3rd']);
            })
            .then(done, done);
        });
      });

      describe('when the second key is unknown', function () {
        beforeEach(function () {
          promise = $localForage
            .setItem(['first', 'third'], ['1st', '3rd'])
            .then(function () {
              return $localForage.getItem(['first', 'second', 'third']);
            });
        });

        it('returns the array with the second item null', function (done) {
          promise
            .then(function (resolved) {
              expect(resolved).toEqual(['1st', null, '3rd']);
            })
            .then(done, done);
        });
      });

      describe('when the last key is unknown', function () {
        beforeEach(function () {
          promise = $localForage
            .setItem(['first', 'second'], ['1st', '2nd'])
            .then(function () {
              return $localForage.getItem(['first', 'second', 'third']);
            });
        });

        it('returns the array with the last item null', function (done) {
          promise
            .then(function (resolved) {
              expect(resolved).toEqual(['1st', '2nd', null]);
            })
            .then(done, done);
        });
      });
    });
  });

  describe('#removeItem', function () {
    describe('with a string key', function () {
      beforeEach(function () {
        promise = $localForage
          .setItem('key', 'value')
          .then(function () {
            return $localForage.removeItem('key');
          });
      });

      it('returns null when looking up the key', function (done) {
        promise
          .then(function () {
            return $localForage.getItem('key');
          })
          .then(function (resolved) {
            expect(resolved).toBe(null);
          })
          .then(done, done);
      });
    });

    describe('with an array key', function () {
      beforeEach(function () {
        promise = $localForage
          .setItem(['first', 'second', 'third'], ['1st', '2nd', '3rd'])
          .then(function () {
            return $localForage.removeItem(['second', 'third']);
          });
      });

      it('returns null when looking up the removed keys', function (done) {
        promise
          .then(function () {
            return $localForage.getItem(['first', 'second', 'third']);
          })
          .then(function (resolved) {
            expect(resolved).toEqual(['1st', null, null]);
          })
          .then(done, done);
      });
    });
  });

  describe('#iterate', function () {
    var keys;
    var values;
    var iterationNumbers;

    beforeEach(function () {
      keys = [];
      values = [];
      iterationNumbers = [];
    });

    describe('it should return all set key/value pairs', function () {
      beforeEach(function () {
        promise = $localForage
          .setItem(['first', 'second', 'third'], ['1st', '2nd', '3rd'])
          .then(function () {
            return $localForage.iterate(function (value, key, iterationNumber) {
              keys.push(key);
              values.push(value);
              iterationNumbers.push(iterationNumber);
            });
          });
      });

      it('calls callback with all keys', function (done) {
        promise
          .then(function () {
            expect(keys).toEqual(['first', 'second', 'third']);
          })
          .then(done, done);
      });

      it('calls callback with all values', function (done) {
        promise
          .then(function () {
            expect(values).toEqual(['1st', '2nd', '3rd']);
          })
          .then(done, done);
      });

      it('calls callback with iteration number', function (done) {
        promise
          .then(function () {
            expect(iterationNumbers).toEqual([1, 2, 3]);
          })
          .then(done, done);
      });
    });

    describe('when callback has a defined return value', function () {
      beforeEach(function () {
        promise = $localForage
          .setItem(['first', 'second', 'third'], ['1st', '2nd', '3rd'])
          .then(function () {
            return $localForage.iterate(function (value, key, iterationNumber) {
              keys.push(key);
              values.push(value);
              iterationNumbers.push(iterationNumber);

              if (key === 'second') {
                return 'resolved early';
              }

              return undefined;
            });
          });
      });

      it('it resolves with the return value', function (done) {
        promise
          .then(function (resolved) {
            expect(resolved).toBe('resolved early');
          })
          .then(done, done);
      });

      it('it only calls with first two keys', function (done) {
        promise
          .then(function (resolved) {
            expect(keys).toEqual(['first', 'second']);
          })
          .then(done, done);
      });

      it('it only calls with first two values', function (done) {
        promise
          .then(function (resolved) {
            expect(values).toEqual(['1st', '2nd']);
          })
          .then(done, done);
      });

      it('it only calls with first two iteration numbers', function (done) {
        promise
          .then(function (resolved) {
            expect(iterationNumbers).toEqual([1, 2]);
          })
          .then(done, done);
      });
    });
  });

  describe('#pull', function () {
    describe('with a string key', function () {
      beforeEach(function () {
        promise = $localForage
          .setItem(['first', 'second', 'third'], ['1st', '2nd', '3rd'])
          .then(function () {
            return $localForage.pull('second');
          });
      });

      it('returns the value at the key supplied', function (done) {
        promise
          .then(function (resolved) {
            expect(resolved).toBe('2nd');
          })
          .then(done, done);
      });

      it('removes the value at the key specified', function (done) {
        promise
          .then(function () {
            return $localForage.getItem('second')
          })
          .then(function (resolved) {
            expect(resolved).toBe(null);
          })
          .then(done, done);
      });
    });

    describe('with an array key', function () {
      beforeEach(function () {
        promise = $localForage
          .setItem(['first', 'second', 'third'], ['1st', '2nd', '3rd'])
          .then(function () {
            return $localForage.pull(['second', 'third']);
          });
      });

      it('returns the values at the keys supplied', function (done) {
        promise
          .then(function (resolved) {
            expect(resolved).toEqual(['2nd', '3rd']);
          })
          .then(done, done);
      });

      it('removes the values at the keys specified', function (done) {
        promise
          .then(function () {
            return $localForage.getItem(['first', 'second', 'third'])
          })
          .then(function (resolved) {
            expect(resolved).toEqual(['1st', null, null]);
          })
          .then(done, done);
      });
    });
  });

  describe('#clear', function () {
    beforeEach(function () {
      promise = $localForage
        .setItem(['first', 'second', 'third'], ['1st', '2nd', '3rd'])
        .then(function () {
          return $localForage.clear();
        });
    });

    it('does not call the callback when iterate is called', function (done) {
      promise
        .then(function () {
          return $localForage.iterate(function () {
            throw new Error('Should not be called');
          });
        })
        .then(done, done);
    });
  });

  describe('#key', function () {
    describe('with a key index within range', function () {
      beforeEach(function () {
        promise = $localForage
          .setItem(['first', 'second', 'third'], ['1st', '2nd', '3rd'])
          .then(function () {
            return $localForage.key(2);
          });
      });

      it('it resolves with the nth key', function (done) {
        promise
          .then(function (resolved) {
            expect(resolved).toEqual('third');
          })
          .then(done, done);
      });
    });

    describe('with a key index out of range', function () {
      beforeEach(function () {
        promise = $localForage
          .setItem(['first', 'second', 'third'], ['1st', '2nd', '3rd'])
          .then(function () {
            return $localForage.key(4);
          });
      });

      it('it resolves with the nth key', function (done) {
        promise
          .then(function (resolved) {
            expect(resolved).toBe(null);
          })
          .then(done, done);
      });
    });
  });

  describe('#keys', function () {
    describe('with set keys', function () {
      beforeEach(function () {
        promise = $localForage
          .setItem(['first', 'second', 'third'], ['1st', '2nd', '3rd'])
          .then(function () {
            return $localForage.keys();
          });
      });

      it('returns all of the set keys', function (done) {
        promise
          .then(function (resolved) {
            expect(resolved).toEqual(['first', 'second', 'third']);
          })
          .then(done, done);
      });
    });

    describe('with set keys', function () {
      beforeEach(function () {
        promise = $localForage
          .clear()
          .then(function () {
            return $localForage.keys();
          });
      });

      it('returns an empty array', function (done) {
        promise
          .then(function (resolved) {
            expect(resolved).toEqual([]);
          })
          .then(done, done);
      });
    });
  });

  describe('#bind and #unbind', function () {
    var $scope;

    beforeEach(function () {
      $scope = $rootScope.$new();
    });

    describe('when unbind is called with that key', function () {
      beforeEach(function (done) {
        promise = $localForage
          .bind($scope, 'key')
          .then(function () {
            return $localForage.unbind($scope, 'key');
          })
          .then(done, done);
      });

      it('removes the item from $localForage', function (done) {
        promise
          .then(function () {
            return $localForage.getItem('key');
          })
          .then(function (resolved) {
            expect(resolved).toBe(null);
          })
          .then(done, done);
      });

      describe('when key is changed on $scope', function () {
        beforeEach(function () {
          $scope.key = 'changed';
        });

        it('does not update $localForage', function (done) {
          promise
            .then(function () {
              return $localForage.getItem('key');
            })
            .then(function (resolved) {
              expect(resolved).toBe(null);
            })
            .then(done, done);
        });
      });
    });

    describe('when the $scope value changes', function () {
      beforeEach(function (done) {
        promise = $localForage
          .bind($scope, 'key')
          .then(done, done);
      });

      fit('changes the value in $localForage', function (done) {
        window.setTimeout(function () {
          promise
            .then(function () {
              console.log('changing scope key', $scope.key);
              $scope.key = 'changed';
              console.log('changed scope key', $scope.key);
              return $q.resolve();
            })
            .then(function () {
              return $localForage.getItem('key');
            })
            .then(function (resolved) {
              expect(resolved).toBe('changed');
              done();
            });
        }, 1000);
      });
    });
  });

  function startDigest() {
    return setInterval($rootScope.$digest, 10);
  }
});
