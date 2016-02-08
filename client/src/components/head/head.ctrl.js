var common = require('../../../../common');

module.exports = ['topLevelData', '$rootScope', '$scope', '$location', 'track', head];

function head(topLevelData, $rootScope, $scope, $location, track){

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

		if (seo === 'defaults'){
			angular.extend(ctrl, defaults);

		} else {
			angular.extend(ctrl, defaults, seo);
		}

		track.page({
			page: $location.path(),
			title: ctrl.title
		});
	}

}