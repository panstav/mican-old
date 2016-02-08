require('html5shiv');

var dataObj = {
	domain: 'DOMAIN_NAME',
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

// finally - ping google analytics
(function(i, s, o, g, r, a, m){i['GoogleAnalyticsObject'] = r;i[r] = i[r] || function(){(i[r].q = i[r].q || []).push(arguments)}, i[r].l = 1*new Date();a = s.createElement(o), m = s.getElementsByTagName(o)[0];a.async = 1;a.src = g;m.parentNode.insertBefore(a, m)})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');window.ga('create', 'ANALYTICS_KEY', 'auto');window.ga('send', 'pageview');