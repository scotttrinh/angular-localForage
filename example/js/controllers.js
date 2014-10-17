'use strict';

/* Controllers */

app.controller('MyCtrl', ['$scope', '$localForage', function($scope, $localForage) {
	$scope.myObj = {}; // for the directive

	$scope.store = function(data) {
		$localForage.setItem('myTextStored', data).then(function(data) {
			$scope.myText = '';
			$scope.myTextStored = data;
		});
	};

	// init value
	$localForage.getItem('myTextStored').then(function(data) {
		$scope.myTextStored = data;
	});

	$localForage.keys().then(function(data) {
		console.log('list of keys', data);
	});

	var lf2 = $localForage.createInstance({
		name: '2nd',
		driver: 'localStorageWrapper'
	});

	lf2.setItem('my2ndInstance', 'this is.. NEW DATA').then(function(data) {
		console.log('set:', data);
	});

	$localForage.instance('2nd').getItem('my2ndInstance').then(function(data) {
		console.log('get:', data);
	});

	lf2.length().then(function(data) {
		console.log('length for this instance:', data);
	});
}]);