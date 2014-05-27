<a name="0.2.5"></a>
# 0.2.5 (2014-05-27)


## Bug Fixes

- readded changes that disappeared in the build for  #16 (avoiding attributes from objects before store it on localforage)
 ([c1175e0c](https://github.com/ocombe/angular-localForage/commit/c1175e0c7a5fc77dbf3a38a0fe5eec1f2f17b45e))


<a name="0.2.4"></a>
# 0.2.4 (2014-05-26)


## Bug Fixes

- error on ipad (safari/chrome) where key could be null and throw an error
 ([0011d110](https://github.com/ocombe/angular-localForage/commit/0011d1100331f691a7ddd3b694895e3f7c188bbc))
- remove $promise attributes from objects before we store them on localforage.
 ([6f6f11ab](https://github.com/ocombe/angular-localForage/commit/6f6f11ab224d894c1a4e477b2d87131612a5f074))


## Features

- Added a validation for commits & a task to auto generate the changelog
 ([f9658263](https://github.com/ocombe/angular-localForage/commit/f96582636824bd583f68e7b3a2d9ea645d83e6e3))
- new tests for getItem/setItem functions
 ([61efd115](https://github.com/ocombe/angular-localForage/commit/61efd1153fa7c8f0d37ab493f29480ce5317ece4))


## Documentation

- instructions for contributing
 ([2a84fc4c](https://github.com/ocombe/angular-localForage/commit/2a84fc4cbdb15a2ae6e1c47dfd229b0ea7f29a48))


# 0.2.3 (14 May 2014)
* Added gulpfile.js to test & build the dist files
* Fix bug #14 (broadcast removeItem: notify.setItem instead of notify.removeItem)

# 0.2.2 (13 May 2014)
* Update localforage to 0.8.1

# 0.2.1 (12 May 2014)
* Update bower.json to fix bug #12

# 0.2.0 (30 April 2014)
* setPrefix has been removed from code
* setItem now returns the value set in the promise resolve
* **Breaking change**: due to changes in localForage, you now need to configure localforage before any call has been made to it (in your module config for example), you can't configure it after init
* Added an example app
* Moved angular-localForage files to dist folder and the files have been renamed in lowercase to keep consistency with localforage

# 0.1.4 (10 April 2014)
* Fix bug with prefixing for localstorage (bug #10)

# 0.1.3 (07 April 2014)
* Bump to localForage 0.3.1

# 0.1.2 (02 April 2014)
* Bump to localForage 0.3.0

# 0.1.1 (24 Mars 2014)
* Updated bower localstorage version to 0.2.0

# 0.1.0 (19 Mars 2014)
* Added a changelog !
* Using localForage 0.1.1 with the new config options
* **Breaking change**: setPrefix has been removed, use the config function from now on
* Renamed all the functions to keep consistency with the localForage function names (set/get/remove/clearAll/getKeyAt/getLength/getDriver are renammed setItem/getItem/removeItem/clear/key/length/driver). The old function names are still available.
* Added a test to check for "InvalidStateError" due to private browsing in firefox and switching to localstorage when this is the case
* Fixed bug #4 [removeItem needs to use prefix](https://github.com/ocombe/angular-localForage/issues/4)
* Added missing package.json (for tests) and updated tests