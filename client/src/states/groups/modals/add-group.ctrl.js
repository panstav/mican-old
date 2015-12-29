module.exports = ['user', addGroup];

function addGroup(user){

	var ctrl = this;

	this.showValidation = false;

	this.newGroup = {
		displayName: '',
		field: '',
		desc: '',

		amAdmin: false,

		// meta
		suggestedField: '',
		comment: ''
	};

	this.newGroupField = false;

	this.send = function(valid){

		// all validation matter are set at html
		if (!valid) return ctrl.showValidation = true;

		// prep and send
		ctrl.showValidation = false;

		var newGroupObj = angular.copy(ctrl.newGroup);

		// send new group to server - passing through userObj
		user.createGroup(newGroupObj);
	}

}