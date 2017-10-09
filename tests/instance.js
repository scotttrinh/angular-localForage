describe('Module: LocalForageModule, Instance', function () {
  var $localForage;
  var $rootScope;
  var $window;

  angular.module('app', ['LocalForageModule']);

  beforeEach(module('app'));

  beforeEach(inject(function ($injector) {
    $localForage = $injector.get('$localForage');
    $rootScope = $injector.get('$rootScope');
    $window = $injector.get('$window');
  }));

  describe('#createInstance', function () {
    describe('with no config object', function () {
      it('should throw', function () {
        expect($localForage.createInstance).toThrow();
      });
    });

    describe('with a config object', function () {
      var instance;

      beforeEach(function () {
        spyOn($window.localforage, 'createInstance');

        instance = $localForage.createInstance({
          name: 'testInstance',
          driver: 'test driver',
        });
      });

      it('returns the instance', function () {
        expect(instance).toBeDefined();
      });

      it('calls the localforage#createInstance method', function () {
        expect($window.localforage.createInstance).toHaveBeenCalledWith({
          name: 'testInstance',
          driver: 'test driver',
        });
      });

      describe('with a naming collision', function () {
        beforeEach(function () {
          $localForage.createInstance({ name: 'name' });
        });

        it('throws', function () {
          expect(function () {
            $localForage.createInstance({ name: 'name' });
          }).toThrow(Error('A localForage instance with the name name is already defined.'));
        });
      });
    });
  });

  describe('#instance', function () {
    describe('when invoked with no parameter', function () {
      it('returns the default instance', function () {
        expect($localForage.instance()._localforage._config.name).toBe('lf');
        expect($localForage.instance()._localforage._config.storeName).toBe('keyvaluepairs');
      });
    });

    describe('when invoked with a string name', function () {
      describe('that does not exist', function () {
        it('throws', function () {
          expect(function () {
            $localForage.instance('not a valid name');
          })
            .toThrow(Error('No localForage instance of that name exists.'));
        });
      });

      describe('that exists', function () {
        it('returns the instance', function () {
          expect($localForage.instance('lf')._localforage._config.name).toBe('lf');
        });
      });
    });

    describe('with a non-string parameter', function () {
      it('throws', function () {
        expect(function () {
          $localForage.instance(null);
        }).toThrow(Error('The parameter should be a string.'));
      });
    });
  });
});
