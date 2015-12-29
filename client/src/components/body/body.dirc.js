var controller = require('./body.ctrl');

module.exports = [directive];

function directive(){
	return {

		restrict: 'E',

		controller: controller,
		controllerAs: 'main',
		
		link: linkFn

	};
}

function linkFn($scope, $element){

	// change body state from 'loading' to 'loaded' as a post-angular-init css cue
	angular.element($element).attr('step', 'loaded');
	
}