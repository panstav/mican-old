var controller = require('./modal.ctrl.js');

var req = require.context('../..', true, /modals\/.+\.jade/);
var templatesMap = req.keys().reduce(templateNames, {});

module.exports = ['$compile', directive];

function directive($compile){
	return {

		scope: {
			url: '='
		},

		link: linkFn,

		restrict: 'E',

		controllerAs: 'modal',
		controller: controller

	};

	function linkFn($scope, element){

		$scope.$watch('url', function(newVal){
			element.html(templatesMap[newVal]);

			$compile(element.contents())($scope);
		});

	}

}

function templateNames(templates, path){
	var name = path.match(/modals\/(.+)\.jade/)[1];
	templates[name] = req(path);

	return templates;
}
