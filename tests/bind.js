describe('Module: LocalForageModule, Bind', function () {
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

  describe('#bind', function () {
    var $scope;

    beforeEach(function () {
      $scope = $rootScope.$new();
    });

    describe('called with no arguments', function () {
      it('throws', function () {
        expect($localForage.bind).toThrow(Error('You must define a key to bind'));
      });
    });

    describe('with a string key', function () {
      describe('with an existing key', function () {
        beforeEach(function () {
          var instance = $localForage.instance('lf');
          $scope.key = undefined;
          spyOn(instance, 'getItem').and.returnValue($q.resolve('value'));
          spyOn(instance, 'setItem');
          $localForage.bind($scope, 'key');
          $scope.$digest();
        });

        afterEach(function () {
          $localForage.setItem.calls.reset();
        });

        it('sets the $scope key to the returned value', function () {
          expect($scope.key).toBe('value');
        });

        it('calls $localForage#setItem with the returned value', function () {
          expect($localForage.setItem).toHaveBeenCalledWith('key', 'value');
        });

        describe('when the $scope value changes', function () {
          describe('with a string value', function () {
            beforeEach(function () {
              $scope.key = 'changed';
              $scope.$digest();
            });

            it('calls $localForage#setItem with the new value', function () {
              expect($localForage.setItem).toHaveBeenCalledWith('key', 'changed');
            });
          });
        });
      });

      describe('with a non-existent key', function () {
        beforeEach(function () {
          var instance = $localForage.instance('lf');
          $scope.key = undefined;
          spyOn(instance, 'getItem').and.returnValue($q.reject());
          spyOn(instance, 'setItem').and.returnValue($q.resolve());
          $localForage.bind($scope, 'key');
          $scope.$digest();
        });

        afterEach(function () {
          $localForage.setItem.calls.reset();
        });

        it('sets the $scope key to the default value', function () {
          expect($scope.key).toBe('');
        });

        it('calls $localForage#setItem with the default value', function () {
          expect($localForage.setItem).toHaveBeenCalledWith('key', '');
        });

        describe('when the $scope value changes', function () {
          describe('with a string value', function () {
            beforeEach(function () {
              $scope.key = 'changed';
              $scope.$digest();
            });

            it('calls $localForage#setItem with the new value', function () {
              expect($localForage.setItem).toHaveBeenCalledWith('key', 'changed');
            });
          });
        });
      });
    });

    describe('with an options object', function () {
      describe('with an existing key', function () {
        beforeEach(function () {
          $scope.key = undefined;
          spyOn($localForage, 'getItem').and.returnValue($q.resolve('value'));
          spyOn($localForage, 'setItem');
          $localForage.bind($scope, {
            key: 'instanceKey',
            scopeKey: 'key',
            defaultValue: 'default',
            name: 'lf'
          });
          $scope.$digest();
        });

        afterEach(function () {
          $localForage.setItem.calls.reset();
        });

        it('calls $localForage#getItem with the key', function () {
          expect($localForage.getItem).toHaveBeenCalledWith('instanceKey', true);
        });

        it('sets the $scope key to the returned value', function () {
          expect($scope.key).toBe('value');
        });

        it('calls $localForage#setItem with the returned value', function () {
          expect($localForage.setItem).toHaveBeenCalledWith('instanceKey', 'value');
        });

        describe('when the $scope value changes', function () {
          describe('with a string value', function () {
            beforeEach(function () {
              $scope.key = 'changed';
              $scope.$digest();
            });

            it('calls $localForage#setItem with the new value', function () {
              expect($localForage.setItem).toHaveBeenCalledWith('instanceKey', 'changed');
            });
          });
        });
      });

      describe('with a non-existent key', function () {
        beforeEach(function () {
          $scope.key = undefined;
          spyOn($localForage, 'getItem').and.returnValue($q.reject(null));
          spyOn($localForage, 'setItem');
          $localForage.bind($scope, {
            key: 'instanceKey',
            scopeKey: 'key',
            defaultValue: 'default',
            name: 'lf'
          });
          $scope.$digest();
        });

        afterEach(function () {
          $localForage.setItem.calls.reset();
        });

        it('calls $localForage#getItem with the key', function () {
          expect($localForage.getItem).toHaveBeenCalledWith('instanceKey', true);
        });

        it('sets the $scope key to the default value', function () {
          expect($scope.key).toBe('default');
        });

        it('calls $localForage#setItem with the default value', function () {
          expect($localForage.setItem).toHaveBeenCalledWith('instanceKey', 'default');
        });

        describe('when the $scope value changes', function () {
          describe('with a string value', function () {
            beforeEach(function () {
              $scope.key = 'changed';
              $scope.$digest();
            });

            it('calls $localForage#setItem with the new value', function () {
              expect($localForage.setItem).toHaveBeenCalledWith('instanceKey', 'changed');
            });
          });
        });
      });
    });
  });

  describe('#unbind', function () {
    var $scope;

    beforeEach(function () {
      $scope = $rootScope.$new();
      spyOn($localForage, 'removeItem');
    });

    afterEach(function () {
      $localForage.removeItem.calls.reset();
    });

    describe('called with no arguments', function () {
      it('throws', function () {
        expect($localForage.unbind).toThrow(Error('You must define a key to unbind'));
      });
    });

    describe('with a string key', function () {
      beforeEach(function () {
        $scope.key = 'value';
        $localForage.unbind($scope, 'key');
      });

      it('sets the scope value to null', function () {
        expect($scope.key).toBe(null);
      });

      it('calls $localForage#removeItem with the key', function () {
        expect($localForage.removeItem).toHaveBeenCalledWith('key');
      });
    });

    describe('with an options object', function () {
      beforeEach(function () {
        $scope.key = 'value';
        $localForage.unbind($scope, {
          key: 'instanceKey',
          name: 'lf',
          scopeKey: 'key'
        });
      });

      it('sets the scope value to null', function () {
        expect($scope.key).toBe(null);
      });

      it('calls $localForage#removeItem with the key', function () {
        expect($localForage.removeItem).toHaveBeenCalledWith('instanceKey');
      });
    });
  });
});
