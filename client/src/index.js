require('html5shiv');

var angular =   require('angular');

var states =    require('./states');
var runtime =   require('./runtime');

// load and register angular modules
require('angular-ui-router');
require('angular-cookies');
require('angular-storage');
require('ng-file-upload');
require('angular-scroll');
require('angular-touch');
require('angular-animate');

//-=======================================================---
//------------------ Party
//-=======================================================---

var externalModules = [
	'ui.router',
	'ngAnimate',
	'angularFileUpload',
	'ngCookies',
	'ngTouch',
	'angular-storage',
	'duScroll'
];

angular.module('app', externalModules)
	.config(states)
	.run(runtime)

	.value('domain', 'https://www.darkenu.net')
	.value('facebookAppId', '1011418022209063');

// custom directives, services and (modal) controllers
require('./loader');