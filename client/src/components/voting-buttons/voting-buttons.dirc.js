var controller = require('./voting-buttons.ctrl.js');
var template = require('./voting-buttons.jade');

module.exports = [directive];

function directive(){
	return {

		scope: {
			numVotes: '=',
			userVoted: '='
		},

		restrict: 'E',

		template: template,

		controller: controller,
		controllerAs: 'vtngButtonsCtrl'

	};
}