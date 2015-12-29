var template = require('./social-links.jade');
var controller = require('./social-links.ctrl.js');

module.exports = [directive];

function directive(){
	return {

		scope: {
			displayName: '=',
			links: '='
		},

		restrict: 'E',

		template: template,
		controller: controller,
		controllerAs: 'sLinks'
	};
}