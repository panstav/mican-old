var controller = require('./head.ctrl');

module.exports = [directive];

function directive(){
	return {

		restrict: 'E',

		controller: controller,
		controllerAs: 'head'

	};
}