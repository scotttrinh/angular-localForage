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
- Put angular-localStorage.js into you project
- Add the module ```LocalForageModule``` to your application
```js
angular.module('yourModule', ['LocalForageModule']);
```
- (optional) Configure the ```$localForageProvider```
```js
angular.module('yourModule', ['LocalForageModule'])
.config(['$localForageProvider', function($localForageProvider){
    $localForageProvider.setPrefix('newPrefix');
}]);
```
- Use the ```$localForage``` service or the ```local-forage``` directive
```js
angular.module('yourModule', ['LocalForageModule'])
.controller('yourCtrl', ['$scope', '$localForage', function($scope, $localForage) {
    // Start fresh
    $localForage.clearAll();
    $localForage.set('myName','Olivier Combe').then(function() {
        $localForage.get('myName').then(function(data) {
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

- ```getDriver()```: returns the current localForage driver (sync)

- ```set(key, value)```: stores data (async, promise)

- ```get(key)```: retrieves stored data (async, promise)

- ```remove(key)```: removes stored data (async, promise)

- ```clearAll()```: removed all stored data for your application based on the app prefix (lf by default) (async, promise)

- ```getKeyAt(n)```: retrieves the key at n position in storage. Used internally for clearAll and getKeys functions. It doesn't take prefix into account (async, promise)

- ```getKeys(driver)```: returns all the keys used for storage in your application based on the app prefix (lf by default) (async, promise)

- ```getLength(driver)```: returns the number of items stored. Used internally for clearAll and getKeys functions. It doesn't take prefix into account (async, promise)

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
    $localForageProvider.setPrefix('newPrefix');
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
