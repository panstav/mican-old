var controller = require('./fa-sharing-buttons.ctrl.js');
var template = require('./fa-sharing-buttons.jade');

module.exports = [directive];

function directive(){
	return {

		scope: {
			shareText: '=',
			url: '='
		},

		restrict: 'E',

		template: template,

		controller: controller,
		controllerAs: 'share'

	};
}