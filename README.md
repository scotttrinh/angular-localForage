angular-localForage [![Build Status](https://travis-ci.org/scotttrinh/angular-localForage.svg)](https://travis-ci.org/scotttrinh/angular-localForage)
===================

Angular service &amp; directive for https://github.com/mozilla/localForage (Offline storage, improved.)

This angularJS module is a rewrite of [angular-local-storage by grevory](https://github.com/grevory/angular-local-storage) and [angularLocalStorage by agrublev](https://github.com/agrublev/angularLocalStorage) using the excellent Mozilla library [localForage](https://github.com/mozilla/localForage)


----------

## Features :
- Store your data in the best available storage solution that your browser can offer (IndexedDB / WebSQL or localstorage as a fallback)

- All browsers are supported starting at IE8. For the full list check: [IndexedDB support](http://caniuse.com/#search=indexeddb), [WebSQL support](http://caniuse.com/#search=websql) and [localstorage support](http://caniuse.com/#search=localstorage)

- Everything is async and uses promises

- Use the service or the directive

## Usage :
- Download the project or install via bower `bower install angular-localforage` or npm `npm install angular-localforage`
- Download localForage https://github.com/mozilla/localForage
- Put localforage.js and angular-localForage.js into your project (with localforage.js before angular-localForage.js).
```html
<script src="path/to/localforage.js"></script>
<script src="path/to/angular-localForage.js"></script>
```
- Add the module `LocalForageModule` to your application
```js
angular.module('yourModule', ['LocalForageModule']);
```
- (optional) Configure the `$localForageProvider`. See [below](#configure-the-provider-) for details.
- Use the `$localForage` service or the `local-forage` directive
```js
angular.module('yourModule', ['LocalForageModule'])
.controller('yourCtrl', ['$scope', '$localForage', function($scope, $localForage) {
    $localForage.setItem('myName','Olivier Combe').then(function() {
        $localForage.getItem('myName').then(function(data) {
            var myName = data;
        });
    });
}]);
```
```html
<input local-forage="{key: 'autoStoredKey', name: 'myApp', scopeKey: 'myObj.myVar', defaultValue: 'this is the default value'}" ng-model="myObj.myVar" placeholder="This will be auto stored">
```

## Functions :
- `setDriver(driver)`: you can force the driver to use, check the [localForage documentation](https://github.com/mozilla/localForage#driver-selection-ie-forcing-localstorage) for more information

- `driver()`: returns the current localForage driver (sync)

- `setItem(key/Array<key>, value/Array<value>)`: stores data (async, promise)

- `getItem(key/Array<key>, rejectIfNull)`: retrieves stored data, rejects if rejectIfNull is truthy and one of the values is null (async, promise)

localForage will return null for a lookup on a key that does not exist. If you set `rejectIfNull` to
true, it will reject the promise if the value (or one of the values of the array lookup) is null. If
you normally store `null` in the database, you can use the single arity version of the function to
retrieve the null value, but you have no way to know if you've retrieved `null` or if the key did
not exist.

- `removeItem(key/Array<key>)`: removes stored data (async, promise)

- `pull(key/Array<key>)`: removes stored data and returns it (it's like doing getItem followed by removeItem) (async, promise)

- `clear()`: removed all stored data for your application based on the app prefix (async, promise)

- `key(n)`: retrieves the key at n position in storage. It doesn't take the prefix into account if you use localStorage (async, promise)

- `keys()`: returns all the keys used for storage in your application (async, promise)

- `length()`: returns the number of items stored (async, promise)

- `iterate(iteratorCallback)`: Iterate over all value/key pairs in datastore. (async, promise)

Iterate supports early exit by returning non `undefined` value inside `iteratorCallback` callback.
Resulting value will be passed to the promise as the result of iteration.
You can use this to make a search in your data:
```js
$localForage.iterate(function(value, key, iterationNumber) {
    if(angular.isInt(value) && value > 10) {
        return key;
    }
}).then(function(data) {
    // data is the key of the value > 10
});
```

- `bind($scope, key/params object)`: lets you directly bind a LocalForage value to a $scope variable (async, promise)
```js
$localForage.bind($scope, 'myStorageKey');
```
**Note: It only binds when the object is already stored in the database or when you provide a default value.**
```js
$localForage.bind($scope, {
    key: 'myStorageKey', // required
    defaultValue: {test: 'my test'}, // a default value (needed if it is not already in the database)
    scopeKey: 'myObj.myVar', // the name of the scope key (if you want it to be different from key)
    name: 'myApp' // instance name
});
```

- `unbind($scope, key[, scopeKey])`: lets you unbind a variable from localForage while removing the value from both the scope and the storage (async, promise)

## Directive :
You can directly bind a scope value from within your html. With the `local-forage` directive, you can either use just the key parameter:
```html
<input local-forage="autoStoredKey" ng-model="autoStoredKey" placeholder="This will be auto stored">
```

Or give an object parameter:
```html
<input local-forage="{key: 'autoStoredKey', name: 'myApp', scopeKey: 'myObj.myVar', defaultValue: 'this is the default value'}" ng-model="myObj.myVar" placeholder="This will be auto stored">
```

`key` is the only required parameter. The other options are:
- `name`: if you want to store your values in a specific instance (See [below](#multiple-instances) for more info on multiple instances)
- `scopeKey`: if you want to store the value in the scope under a different key from the one in storage. You can for example use a specific key of an object by using `myObj.myVar`
- `defaultValue`: if you want to define a ...default value

## Configure the provider :
You can configure the `$localForageProvider`. Any parameter that you set here will be the default for any new localforage instance.
You can for example set your own prefix for storage (by default `lf` is used).
```js
angular.module('yourModule', ['LocalForageModule'])
.config(['$localForageProvider', function($localForageProvider){
    $localForageProvider.config({
        driver      : 'localStorageWrapper', // if you want to force a driver
        name        : 'myApp', // name of the database and prefix for your data, it is "lf" by default
        version     : 1.0, // version of the database, you shouldn't have to use this
        storeName   : 'keyvaluepairs', // name of the table
        description : 'some description'
    });
}]);
```

You can also choose to be notified by broadcast on set and remove.
```js
angular.module('yourModule', ['LocalForageModule'])
.config(['$localForageProvider', function($localForageProvider){
    $localForageProvider.setNotify(true, true); // itemSet, itemRemove
}]);
```

The broadcast are the following :
```js
$rootScope.$broadcast('LocalForageModule.setItem', {key: key, newvalue: value, driver: localforage.driver});
$rootScope.$broadcast('LocalForageModule.removeItem', {key: key, driver: localforage.driver});
```

## Multiple instances
You can use multiple instances of localForage at the same time. To create a new instance, call `createInstance` with a config object (sync):
```js
    var lf2 = $localForage.createInstance({
		name: '2nd',
		driver: 'localStorageWrapper'
	});
```

The parameters will inherit the default parameters that you might have configured in the config phase of your application (See [above](#configure-the-provider-) for details), but the new config object will overwrite them.
It means that you can have one instance using localStorage, and one instance using indexedDB/WebSQL, at the same time !
The instance will take the name that you will define in the config object. You can get an instance previously created by using the `instance` method:
```js
    var lf2 = $localForage.instance('2nd');
```

The `instance` method will return the default instance if you don't give a name parameter.

## Unit tests
Download the required libs :

```
npm install
bower install
```

Then start the tests with :

```
gulp karma
```

It will launch Chrome and Firefox, edit the `karma` task in `gulpfile.js` if you want to change
something. We could use more tests, see "contributing" below.

##Contributing

I would love to have community contributions and support! A few areas where could use help right now:

* Writing tests
* Elaborating on documentation
* Creating examples for the docs
* Bug reports and/or fixes

If you want to contribute, please submit a pull request, or contact olivier.combe@gmail.com for more information.

The commits messages need to be validated. Use the following commands to add a git hook that will check if you follow the convention :
* `cd <angular-localForage-repo>`
* `ln -s ../../validate-commit-msg.js .git/hooks/commit-msg`

When you commit your messages, follow this convention :
`<type>: <subject> <BLANK LINE> <optional message>`

For example:
```no-highlight
feat: Added validation commit msg file

Installation:
 * cd <angular-localForage-repo>
 * ln -s ../../validate-commit-msg.js .git/hooks/commit-msg
```

The following types are accepted in the commit messages:
- feat
- fix
- docs
- style
- refactor
- perf
- test
- chore
- revert

But only feat/fix/docs/perf will be in the changelog.

If you do a breaking change, add an explanation preceded by `BREAKING CHANGE: `. For example:
```no-highlight
fix: remove deprecated promise unwrapping

BREAKING CHANGE: promise unwrapping has been removed.
It can no longer be turned on.
```

If you want to reference an issue, you can add a new line with either `Closes` or `Fixes` followed by the issue number. For example:
```no-highlight
feat: Added changelog auto generation

Usage: gulp changelog

Fixes #62
```

You can fix / close multiple issue with one commit, just add a new line for each.
