module.exports = ['user', '$http', '$timeout', 'pars', 'gotHebrew', groupCard];

function groupCard(user, $http, $timeout, pars, gotHebrew){

	return {

		restrict: 'A',

		controllerAs: 'card',
		controller: ['$scope', controller],

		link: linkFn

	};

	function controller($scope){

		var group = $scope.group;

		// show group details
		this.openDrawer = openDrawer;

		this.squaredFontAwesomeClass = pars.squaredFontAwesomeClassByPlatform;

		this.linkTitle = pars.linkTitleByPlatform;

		this.star = function(){
			user.starToggle($scope.group._id, function(){
				$scope.group.starredByUser = !$scope.group.starredByUser;
			});
		};

		function openDrawer(){

			if (group.open) return group.open = false;

			if (group.gotDetails) return group.open = true;

			$http.post('api/groups/whois', { groupID: group._id })

				.success(
				function(groupDoc){

					// append farther details onto that group
					angular.extend(group, groupDoc);

					// group card is ready to open - go ahead
					group.open = true;
					group.gotDetails = true;

					$timeout(function(){
						group.loading = false;
					}, 300);
				}
			)
		}

	}

	function linkFn(scope, element, attrs){

		if (!gotHebrew(scope.group.displayName)){
			scope.group.noHebrew = true;
		}

	}

}