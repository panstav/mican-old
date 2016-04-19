const template = require('./draft.jade');
const controller = require('./draft.ctrl');

module.exports = [directive];

function directive(){
	return {

		restrict: 'E',

		template,

		controller,
		controllerAs: 'draft'

	};
}