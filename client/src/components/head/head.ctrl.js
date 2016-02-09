var common = require('../../../../common');

module.exports = ['topLevelData', '$rootScope', '$scope', '$location', head];

function head(topLevelData, $rootScope, $scope, $location){

	var ctrl = this;

	this.domain = topLevelData.domain;

	var defaults = {
		title: common.title,
		description: common.description,
		image: common.logo.square,
		twitter: common.twitter
	};

	var pageTitle;

	$rootScope.$on('seo:update', function(event, data){
		seoUpdate(data);
	});

	$rootScope.$on('$stateChangeSuccess', function(){
		if ($scope.$state) seoUpdate($scope.$state.current.seo);

		// ping google analytics
		window.ga('send', 'pageview');
	});

	function seoUpdate(seo){

		if (!seo) return false;

		if (seo.title) pageTitle = seo.title;

		if (seo.sectionTitle){
			seo.title = pageTitle + ' - ' + seo.sectionTitle;

			delete seo.sectionTitle;
		}

		if (!seo.canonical) delete ctrl.canonical;

		seo.path = $location.path();

		// append seo data to view
		angular.extend(ctrl, defaults, (seo === 'defaults' ? {} : seo));

	}

}