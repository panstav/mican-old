var controller = require('./tasks.ctrl');
var template = require('./tasks.jade');

module.exports = [directive];

function directive(){
	return {

		restrict: 'E',

		template: template,

		controller: controller,
		controllerAs: 'tOverview'

	};
}