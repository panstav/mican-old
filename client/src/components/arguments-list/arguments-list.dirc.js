var controller = require('./arguments-list.ctrl');
var template = require('./arguments-list.jade');

module.exports = [directive];

function directive(){
	return {

		scope: {
			arguments: '=value',
			limit: '=',
			withVotingButtons: '=',
			withCommentsButtons: '@',
			withShowMoreArguments: '@'
		},

		restrict: 'E',

		template,

		controller,
		controllerAs: 'argsListCtrl'

	};
}