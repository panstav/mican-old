var template = require('./pending-group.jade');

module.exports = [pendingGroup];

function pendingGroup(){

	return {

		controllerAs: 'gPending',
		controller: ['$scope', 'api', controller],

		template: template,
		restrict: 'E',

		scope: {
			groupId: '='
		}

	}

}

function controller($scope, api){

	var ctrl = this;

	api.groups.getAdminEmail($scope.groupId, function(data){
		ctrl.adminEmail = data.adminEmail;
	});

}