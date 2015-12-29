var template = require('./homepage.jade');
var controller = require('./homepage.ctrl');

module.exports = [directive];

function directive(){
	return {

		restrict: 'E',

		template: template,

		controller: controller,
		controllerAs: 'home'
		
	};
}