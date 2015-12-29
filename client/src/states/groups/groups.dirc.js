var template = require('./groups.jade');
var controller = require('./groups.ctrl.js');

module.exports = [directive];

function directive(){
	return {

		restrict: 'E',

		template: template,
		controller: controller,
		controllerAs: 'overview'

	};
}