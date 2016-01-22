require('html5shiv');

var dataObj = {
	domain: 'DOMAIN_NAME',
	googleAnalyticsKey: 'ANALYTICS_KEY',
	facebookAppId: 'FACEBOOK_APP_ID',
	packageDependencies: PACKAGE_JSON_FILTERED_DEPENDENCIES
};

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
	.value('topLevelData', dataObj)
	.config(states)
	.run(runtime);

// custom directives, services and (modal) controllers
require('./loader');