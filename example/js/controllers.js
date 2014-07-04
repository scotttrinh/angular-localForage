'use strict';

/* Controllers */

app.controller('MyCtrl', ['$scope', '$localForage', function($scope, $localForage) {
	$scope.store = function(data) {
		$localForage.setItem('myTextStored', data).then(function(data) {
			$scope.myText = '';
			$scope.myTextStored = data;
		});
	}

	// init value
	$localForage.getItem('myTextStored').then(function(data) {
		$scope.myTextStored = data;
	});

	$localForage.keys().then(function(data) {
		console.log('list of keys', data);
	})
}]);