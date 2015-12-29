module.exports = ['$rootScope', '$scope', '$location', 'track', 'domain', head];

function head($rootScope, $scope, $location, track, domain){

	var ctrl = this;

	this.domain = domain;

	var defaults = {

		title: 'דרכנו',
		description: 'אינדקס יוזמות חברתיות. הגיע הזמן להתארגן ברשת!',
		image: 'https://s3.eu-central-1.amazonaws.com/darkenu/graphics/darkenuLogo.jpg',

		twitter: {
			card: 'summary',
			handle: '@darkenunet',
			creator: '@stavgeffen'
		}

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