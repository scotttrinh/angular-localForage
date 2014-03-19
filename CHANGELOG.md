# 0.1.0 (19 Mars 2014)
* Added a changelog !
* Using localForage 0.1.1 with the new config options
* **Breaking change**: setPrefix has been removed, use the config function from now on
* Renamed all the functions to keep consistency with the localForage function names (set/get/remove/clearAll/getKeyAt/getLength/getDriver are renammed setItem/getItem/removeItem/clear/key/length/driver). The old function names are still available.
* Added a test to check for "InvalidStateError" due to private browsing in firefox and switching to localstorage when this is the case
* Fixed bug #4 [removeItem needs to use prefix](https://github.com/ocombe/angular-localForage/issues/4)
* Added missing package.json (for tests) and updated tests