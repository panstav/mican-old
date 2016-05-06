require('html5shiv');

const angular = require('angular');
const states = require('./states/index');

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

const externalModules = [
	'ui.router',
	'ngAnimate',
	'angularFileUpload',
	'ngCookies',
	'ngTouch',
	'angular-storage',
	'duScroll'
];

const dataObj = {
	domain: 'DOMAIN_NAME',
	facebookAppId: 'FACEBOOK_APP_ID',
	packageDependencies: PACKAGE_JSON_FILTERED_DEPENDENCIES,
	groupsSum: GROUPS_SUM,
	production: PRODUCTION
};

const config = [
	'$compileProvider', '$stateProvider', '$locationProvider', '$urlRouterProvider', 
	($compileProvider, $stateProvider, $locationProvider, $urlRouterProvider) => {
		
		$compileProvider.debugInfoEnabled(!dataObj.production);
		
		$locationProvider.html5Mode(true);

		// register each state
		for (var stateName in states){
			$stateProvider.state(stateName, states[stateName]);
		}

		// fallback to homepage
		$urlRouterProvider.otherwise('/');
}];

const run = [
	'$rootScope','$state', '$document', 'modal', 'acticons', 'mem', 'user',
	($rootScope, $state, $document, modal, acticons, mem, user) => {

		// check for a pending redirection
		const redirectAfterLogin = mem('continuousRedirection');
		if (redirectAfterLogin) return window.location.href = redirectAfterLogin;

		// attach state to scope for easier access
		$rootScope.$state = $state;

		// handle state-change
		$rootScope.$on('$stateChangeStart', (event, toState, toParams) => {

			// dirty fix for '/groups/' instead of '/groups' case
			if (toState.name === 'singleGroup' && !toParams.groupID.length){
				event.preventDefault();
				return $state.go('groups');
			}

			modal.reset();

			// close menu
			$rootScope.$broadcast('menu:close');

		});

		// handle state-changed
		$rootScope.$on('$stateChangeSuccess', () => {

			// reset top bar iconic actions
			acticons.reset();

			// scroll to top
			$document.scrollTopAnimated(0);

		});

		// get user info
		user.recall();
}];

angular.module('app', externalModules)
	.value('topLevelData', dataObj)
	.config(config)
	.run(run);

// custom directives, services and (modal) controllers
require('./loader');