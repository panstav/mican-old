module.exports = ['$scope', 'modal', 'api', suggestGroup];

function suggestGroup($scope, modal, api){

	var ctrl = this;

	this.openLoginInstead = function(){

		modal.reopen('login');

	};

	this.showValidation = false;

	this.newGroupSuggestion = {
		displayName: '',
		link: '',
		tel: '',
		mail: ''
	};

	this.send = function(){

		// make sure there's at least one contact field filled out and apply it as a form validity test
		let noContact = !ctrl.newGroupSuggestion.link && !ctrl.newGroupSuggestion.tel && !ctrl.newGroupSuggestion.mail;
		$scope.newGroupSuggestionForm.$setValidity('noContact', !noContact);

		// all validation matter are set at html
		if ($scope.newGroupSuggestionForm.$invalid) return ctrl.showValidation = true;

		// remove validation prompts
		ctrl.showValidation = false;

		// prep file for sending
		var newSuggestionObj = { displayName: ctrl.newGroupSuggestion.displayName, contacts: [] };
		if (ctrl.newGroupSuggestion.link) newSuggestionObj.contacts.push({  type: 'link', value: ctrl.newGroupSuggestion.link });
		if (ctrl.newGroupSuggestion.tel)  newSuggestionObj.contacts.push({  type: 'tel',  value: ctrl.newGroupSuggestion.tel });
		if (ctrl.newGroupSuggestion.mail) newSuggestionObj.contacts.push({  type: 'mail', value: ctrl.newGroupSuggestion.mail });

		// send suggestion then close the modal
		api.groups.suggest(newSuggestionObj, modal.reset);
	}

}