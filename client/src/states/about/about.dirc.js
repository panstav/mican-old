var template = require('./about.jade');
var controller = require('./about.ctrl');

module.exports = [directive];

function directive(){
	return {

		restrict: 'E',

		template: template,

		controller: controller,
		controllerAs: 'about'
		
	};
}