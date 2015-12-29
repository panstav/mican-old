var template = require('./admin.jade');
var controller = require('./admin.ctrl.js');

module.exports = [directive];

function directive(){
	return {

		scope: {},

		restrict: 'E',

		template: template,
		controller: controller,
		controllerAs: 'admin'

	}
}