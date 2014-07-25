angular-localForage
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
- Download the project or install via bower ```bower install angular-localForage```
- Download localForage https://github.com/mozilla/localForage
- Put angular-localStorage.js and localforage.js into you project
- Add the module ```LocalForageModule``` to your application
```js
angular.module('yourModule', ['LocalForageModule']);
```
- (optional) Configure the ```$localForageProvider```
```js
angular.module('yourModule', ['LocalForageModule'])
.config(['$localForageProvider', function($localForageProvider){
    $localForageProvider.config({
        driver      : 'localStorageWrapper', // if you want to force a driver
        name        : 'myApp', // name of the database and prefix for your data
        version     : 1.0, // version of the database, you shouldn't have to use this
        storeName   : 'keyvaluepairs', // name of the table
        description : 'some description'
    });
}]);
```
- Use the ```$localForage``` service or the ```local-forage``` directive
```js
angular.module('yourModule', ['LocalForageModule'])
.controller('yourCtrl', ['$scope', '$localForage', function($scope, $localForage) {
    // Start fresh
    $localForage.clearAll();
    $localForage.setItem('myName','Olivier Combe').then(function() {
        $localForage.getItem('myName').then(function(data) {
            var myName = data;
        });
    });

    $scope.params = {
        test: 'value'
    };
}]);
```
```html
<div local-forage="params"></div>
```

## Functions :
- ```setDriver(driver)```: you can force the driver to use, check the [localForage documentation](https://github.com/mozilla/localForage#driver-selection-ie-forcing-localstorage) for more information

- ```driver()```: returns the current localForage driver (sync)

- ```setItem(key, value)```: stores data (async, promise)

- ```getItem(key)```: retrieves stored data (async, promise)

- ```removeItem(key)```: removes stored data (async, promise)

- ```clear()```: removed all stored data for your application based on the app prefix (async, promise)

- ```key(n)```: retrieves the key at n position in storage. Used internally for clearAll and getKeys functions. It doesn't take prefix into account (async, promise)

- ```getKeys(driver)```: returns all the keys used for storage in your application. Be careful with it if you use localstorage because it will return all the keys (not just the ones with your prefix) (async, promise)

- ```length(driver)```: returns the number of items stored. Used internally for clearAll and getKeys functions. Be careful with it if you use localstorage because it will return all the keys (not just the ones with your prefix) (async, promise)

- ```bind($scope, key/params object)```: lets you directly bind a LocalForage value to a $scope variable
```js
$localForage.bind($scope, 'params');
```
```js
$localForage.bind($scope, {
    key: 'params',
    defaultValue: {test: 'my test'},
    storeName: 'myStoreName'
});
```

- ```unbind($scope, key[, storeName])```: lets you unbind a variable from localForage while removing the value from both

## Directive :
You can directly bind a scope value from within your html :
```js
angular.module('yourModule', ['LocalForageModule']).controller('yourCtrl', ['$scope', function($scope) {
    $scope.params = {
        test: 'value'
    };
}]);
```
```html
<div local-forage="params"></div>
```
```html
<div local-forage="{key: 'params', storeName: 'myStoreName'}"></div>
```

## Configure the provider :
You can configure the ```$localForageProvider``` to set your own prefix for storage. By default ```lf``` is used.
```js
angular.module('yourModule', ['LocalForageModule'])
.config(['$localForageProvider', function($localForageProvider){
    $localForageProvider.config({
        name: 'yourprefix'
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

And finally you can set the driver.
```js
angular.module('yourModule', ['LocalForageModule'])
.config(['$localForageProvider', function($localForageProvider){
    $localForageProvider.setDriver('localStorageWrapper');
}]);
```

## Unit tests
Download the required libs :

```
npm install
```

Then start the tests with :

```
npm test
```

It will launch Chrome and Firefox, edit karma.conf.js if you want to change something.

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
