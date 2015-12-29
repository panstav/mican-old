module.exports = ['$scope', 'api', 'mem', editGroupDesc];

function editGroupDesc($scope, api, mem){

	var ctrl = this;

	var groupID = mem('groupID');
	var oldDesc = mem('editingDesc');

	// group desc is displayed as an array of paragraphs, here we display it inside a textarea
	this.desc = oldDesc.join('\n\n');

	this.submit = function(){

		if ($scope.editGroupDescForm.$invalid) return ctrl.showValidation = true;

		ctrl.showValidation = false;

		// send new desc to server
		api.groups.updateDesc({ groupID: groupID, newDesc: ctrl.desc });
	}

}