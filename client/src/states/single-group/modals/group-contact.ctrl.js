module.exports = ['$scope', 'api', 'mem', 'pars', groupContact];

function groupContact($scope, api, mem, pars){

	var ctrl = this;

	var groupID = mem('groupID');
	var contact = mem('contactDetails');

	// are we editing an existing contact?
	if (contact){

		// we are
		this.editingExistingContact = true;

		// prep the contactObj
		contact[contact.channel] = contact.value;

		// apply to view
		this.contact = contact;
	}

	//-=======================================================---
	//------------------ Parsers
	//-=======================================================---

	this.contactChannels = pars.contactChannels;

	this.publicityTypes = pars.publicityTypes;

	//-=======================================================---
	//------------------ Handlers
	//-=======================================================---

	this.remove = function(){
		api.groups.removeContact({ groupID: groupID, contactID: contact._id });
	};

	this.submit = function(){

		if (!$scope.groupContactForm.$valid) return ctrl.showValidation = true;

		ctrl.showValidation = false;

		// validation went smoothly, create new contact object
		var contactObj = {

			groupID: groupID,

			contact: {
				channel:        ctrl.contact.channel,
				nameOfContact:  ctrl.contact.nameOfContact,
				publicity:      ctrl.contact.publicity,
				value:          ctrl.contact[ctrl.contact.channel]
			}

		};

		// attach the current DB id, if we're editing
		if (ctrl.editingExistingContact) contactObj.contact.id = contact._id;

		// lift off
		api.groups.updateContact({ method: ctrl.editingExistingContact ? 'put' : 'post', contactObj: contactObj });
	}

}