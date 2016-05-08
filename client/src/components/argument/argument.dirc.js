var controller = require('./argument.ctrl.js');
var template = require('./argument.jade');

module.exports = [directive];

function directive(){
	return {

		scope: {
			argument: '=value',
			withVotingButtons: '=',
			withCommentsButtons: '@'
		},

		restrict: 'E',

		template: template,

		controller: controller,
		controllerAs: 'argCtrl'

	};
}