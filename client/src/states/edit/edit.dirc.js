const template = require('./edit.jade');
const controller = require('./edit.ctrl.js');

module.exports = [directive];

function directive(){
	return {

		restrict: 'E',

		template,

		controller,
		controllerAs: 'dEdit'

	};
}