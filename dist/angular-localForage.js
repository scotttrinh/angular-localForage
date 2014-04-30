/**
 * copyright: Olivier Combe (https://github.com/ocombe/angular-localForage)
 */

(function(window, angular, localforage, undefined) {
	'use strict';

	var angularLocalForage = angular.module('LocalForageModule', ['ng']);
	angularLocalForage.provider('$localForage', function() {
		localforage.config({
			name: 'lf' // default prefix
		});

		// Send signals for each of the following actions ?
		this.notify = {
			setItem: false,
			removeItem: false
		};

		// Setter for the storage driver
		var setDriver = function(driver) {
			return localforage.setDriver(driver);
		};

		this.setDriver = setDriver;

		// Getter for the storage driver
		var driver = function() {
			return localforage.driver();
		};

		// Setter for notification config, itemSet & itemRemove should be booleans
		this.setNotify = function(itemSet, itemRemove) {
			this.notify = {
				setItem: itemSet,
				removeItem: itemRemove
			};
		};

        this.config = function(config) {
            if(angular.isObject(config)) {
                if(angular.isDefined(config.driver)) {
	                localforage.config(config);
                    return setDriver(config.driver);
                } else {
                    return localforage.config(config);
                }
            }
        }

		this.$get = ['$rootScope', '$q', '$parse', function($rootScope, $q, $parse) {
			var notify = this.notify;
			var watchers = {};

            var prefix = function() {
                return driver() === 'localStorageWrapper' ? localforage.config().name + '.' : '';
            }

			var onError = function(data, args, fct, deferred) {
				if(data === 'InvalidStateError' && driver() === 'asyncStorage') {
					setDriver('localStorageWrapper').then(function() {
						fct(args).then(function(item) {
							deferred.resolve(item);
						}, function(data) {
							deferred.reject(data);
						});
					}, function() {
						deferred.reject(data);
					});
				} else {
					deferred.reject(data);
				}
			}

			// Directly adds a value to storage
			var setItem = function(key, value) {
				var deferred = $q.defer(),
					args = arguments;
				localforage.setItem(prefix() + key, value).then(function success() {
					if(notify.setItem) {
						$rootScope.$broadcast('LocalForageModule.setItem', {key: key, newvalue: value, driver: localforage.driver()});
					}
					deferred.resolve(value);
				}, function error(data) {
					onError(data, args, setItem, deferred);
				});

				return deferred.promise;
			};

			// Directly get a value from storage
			var getItem = function(key) {
				var deferred = $q.defer(),
					args = arguments;
				localforage.getItem(prefix() + key).then(function success(item) {
					deferred.resolve(item);
				}, function error(data) {
					onError(data, args, getItem, deferred);
				});
				return deferred.promise;
			};

			// Remove an item from storage
			var removeItem = function(key) {
				var promise = localforage.removeItem(prefix() + key);
				if(notify.setItem) {
					return promise.then(function(value) {
						$rootScope.$broadcast('LocalForageModule.removeItem', {key: key, driver: localforage.driver()});
					});
				} else {
					return promise;
				}
			};

			// Remove all data for this app from storage (we could use localforage.clear(); but we don't want to remove things without the prefix
			var clear = function() {
				var deferred = $q.defer(),
					args = arguments,
					promises = [];
				getKeys().then(function success(keys) {
					angular.forEach(keys, function(key) {
						promises.push(removeItem(key));
					});

					$q.all(promises).then(function() {
						deferred.resolve();
					});
				}, function error(data) {
					onError(data, args, clearAll, deferred);
				});
				return deferred.promise;
			}

			// Return the key for item at position n
			var key = function(n) {
				var deferred = $q.defer(),
					args = arguments;
				localforage.key(n).then(function success(key) {
					deferred.resolve(key);
				}, function error(data) {
					onError(data, args, key, deferred);
				});
				return deferred.promise;
			};

			var length = function() {
				var deferred = $q.defer(),
					args = arguments; // using $q to avoid using $apply
				localforage.length().then(function success(length) {
					deferred.resolve(length);
				}, function error(data) {
					onError(data, args, length, deferred);
				});
				return deferred.promise;
			}

			// Return the list of keys stored for this application
			var getKeys = function() {
				var deferred = $q.defer(),
					args = arguments;
				length().then(function success(length) {
					var promises = [],
						keys = [],
                        p = prefix();
					for(var i = 0; i < length; i++) {
						promises.push(key(i).then(function(key) {
							if(key.indexOf(p) === 0) {
								keys.push(key.substr(p.length, key.length));
							}
						}));
					}

					$q.all(promises).then(function() {
						deferred.resolve(keys);
					});
				}, function error(data) {
					onError(data, args, getKeys, deferred);
				});
				return deferred.promise;
			}

			/**
			 * Bind - let's you directly bind a LocalForage value to a $scope variable
			 * @param {Angular $scope} $scope - the current scope you want the variable available in
			 * @param {String} key - the name of the variable you are binding
			 * @param {String} key - the name of the variable you are binding OR {Object} opts - key and custom options like default value or unique store name
			 * Here are the available options you can set:
			 * * defaultValue: the default value
			 * * storeName: add a custom store key value instead of using the scope variable name
			 * @returns {*} - returns whatever the stored value is
			 */
			var bind = function($scope, opts) {
				if(angular.isString(opts)) {
					opts = {
						key: opts
					}
				} else if(!angular.isObject(opts) || angular.isUndefined(opts.key)) {
					throw "You must defined a key to bind";
				}
				var defaultOpts = {
					defaultValue: '',
					storeName: ''
				};
				// If no defined options we use defaults otherwise extend defaults
				opts = angular.extend(defaultOpts, opts || {});

				// Set the storeName key for the LocalForage entry
				// use user defined in specified
				var storeName = opts.storeName || opts.key,
					model = $parse(opts.key);

				return getItem(storeName).then(function(item) {
					if(item) { // If it does exist assign it to the $scope value
						model.assign($scope, item);
					} else if(opts.defaultValue) { // If a value doesn't already exist store it as is
						setItem(storeName, opts.defaultValue);
					}

					// Register a listener for changes on the $scope value
					// to update the localForage value
					if(angular.isDefined(watchers[opts.key])) {
						watchers[opts.key]();
					}

					watchers[opts.key] = $scope.$watch($parse(opts.key), function(val) {
						if(angular.isDefined(val)) {
							setItem(storeName, val);
						}
					}, true);
				});
			}

			/**
			 * Unbind - let's you unbind a variable from localForage while removing the value from both
			 * the localForage and the local variable and sets it to null
			 * @param $scope - the scope the variable was initially set in
			 * @param key - the name of the variable you are unbinding
			 * @param storeName - (optional) if you used a custom storeName you will have to specify it here as well
			 */
			var unbind = function($scope, key, storeName) {
				storeName = storeName || key;
				$parse(key).assign($scope, null);
				if(angular.isDefined(watchers[key])) {
					watchers[key](); // unwatch
					delete watchers[key];
				}
				removeItem(storeName);
			}

			return {
				setDriver: setDriver,
                driver: driver,
				getDriver: driver, // deprecated
				setItem: setItem,
                set: setItem, // deprecated
                getItem: getItem,
                get: getItem, // deprecated
				remove: removeItem,
                removeItem: removeItem, // deprecated
				clear: clear,
				clearAll: clear, // deprecated
                key: key,
				getKeyAt: key, // deprecated
				getKeys: getKeys,
				length: length,
				getLength: length, // deprecated
				bind: bind,
				unbind: unbind
			};
		}]
	});

	angularLocalForage.directive('localForage', ['$localForage', function ($localForage) {
		return {
			restrict: 'A',
			link: function ($scope, $element, $attrs) {
				var opts = $scope.$eval($attrs.localForage);
				if(angular.isObject(opts) && angular.isDefined(opts.key) && angular.isDefined(opts.storeName)) {
					$localForage.bind($scope, opts);
				} else {
					$localForage.bind($scope, $attrs.localForage);
				}
			}
		}
	}]);
})(window, window.angular, window.localforage);