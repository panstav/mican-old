module.exports = ['$scope', 'sharer', 'pars', controller];

function controller($scope, sharer, pars){

	this.platforms = sharer.supportedPlatforms;

	this.fontAwesomeClass = pars.fontAwesomeClassByPlatform;

	this.callForAction = sharer.callForAction;

	this.by = function(platform){
		var url = $scope.url || undefined;

		sharer(platform, $scope.shareText, url);
	};

}