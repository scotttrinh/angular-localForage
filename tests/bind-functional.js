describe('Module: LocalForageModule, Bind Functional', function () {
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

  describe('functional', function () {
    var $scope;
    var interval;

    beforeEach(function (done) {
      $scope = $rootScope.$new();
      interval = window.setInterval(() => $rootScope.$digest(), 10);
      $localForage.bind($scope, 'key').then(done).catch(done);
    });

    it('saves changes made to the scope key', function (done) {
      $scope.key = 'changed';

      window.setTimeout(function () {
        $localForage
          .getItem('key')
          .then(function (value) {
            expect(value).toBe('changed');
            window.clearInterval(interval);
            done();
          });
      }, 1500);
    });
  });
});
