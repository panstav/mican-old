var controller = require('./single-group.ctrl');
var template = require('./single-group.jade');

module.exports = [directive];

function directive(){
	return {

		restrict: 'E',

		template: template,

		controller: controller,
		controllerAs: 'sGroup'

	};
}