var emailRegExp = require('../../../../common/email-regexp');

module.exports = ['api', 'user', 'modal', controller];

function controller(api, user, modal){
	
	var ctrl = this;

	this.subscriberEmail = user.getEmail() || '';

	this.subscribe = function(){

		var email = ctrl.subscriberEmail;

		if (email && emailRegExp.test(email)){
			api.addToNewsletter({ email: email });
		}

	};

	this.addGroup = function(){

		if (user.isAnon()) return modal.open('suggest-group');

		modal.open('add-group');

	};

}