'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('myApp', ['LocalForageModule']).config(['$localForageProvider', function($localForageProvider) {
	$localForageProvider.config({
		name: 'myApp' // name of the database and prefix for your data
	});
}]);