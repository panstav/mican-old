module.exports = ['$scope', 'api', 'mem', groupLinks];

function groupLinks($scope, api, mem){

	var ctrl = this;

	var groupID = mem('groupID');
	this.links = mem('groupLinks');

	//-=======================================================---
	//------------------ Handlers
	//-=======================================================---

	this.validateLinks = function(platform){

		var homepage = platform === 'homepage';

		if (homepage) return setValidity('homepage', true);

		var field = ctrl.links[platform];
		var regexp = (platform === 'google' ? 'plus.' : '') + platform + '.com/\.\+';

		return field && setValidity( platform, homepage ? true : !!field.match(new RegExp(regexp)) );

		function setValidity(name, valid){
			$scope.groupLinksForm[name].$setValidity('atPlatform', valid);
		}

	};

	this.submit = function(){

		if (!$scope.groupLinksForm.$valid) return ctrl.showValidation = true;

		ctrl.showValidation = false;

		// validation went smoothly, create new links object
		var linksObj = ctrl.links;
		linksObj.groupID = groupID;

		// lift off
		api.groups.updateLinks(linksObj);
	}

}