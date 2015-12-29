module.exports = ['api', 'mem', login];

function login(api, mem){

	var ctrl = this;

	this.with = function(strategy){

		// store current state so that user will redirect back to current state after login
		mem('continuousRedirection', window.location.href);

		window.location.href = '/' + strategy + '/auth';
	};

	this.linkToMail = {

		address: mem('userEmail') || '',

		send: function(){
			api.users.loginByMail(ctrl.linkToMail.address);
		}

	}

}