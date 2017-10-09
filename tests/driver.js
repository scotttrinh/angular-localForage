describe('Module: LocalForageModule, Driver', function () {
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

  describe('#setDriver', function () {
    beforeEach(function () {
      spyOn($window.localforage, 'setDriver');

      $localForage.setDriver('a driver');
    });

    it('calls setDriver with the passed driver', function () {
      expect($window.localforage.setDriver).toHaveBeenCalledWith('a driver');
    });
  });

  describe('#driver', function () {
    var driver;

    beforeEach(function () {
      spyOn($window.localforage, 'driver').and.returnValue('a driver');

      driver = $localForage.driver();
    });

    it('returns the localforage driver', function () {
      expect(driver).toBe('a driver');
    });
  });

  describe('#defineDriver', function () {
    beforeEach(function () {
      spyOn($window.localforage, 'defineDriver');

      $localForage.defineDriver('a driver');
    });

    it('calls defineDriver with the passed driver', function () {
      expect($window.localforage.defineDriver).toHaveBeenCalledWith('a driver');
    });
  });
});
