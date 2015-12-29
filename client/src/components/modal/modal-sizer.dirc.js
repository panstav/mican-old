module.exports = ['$window', '$timeout', modelSizer];

function modelSizer($window, $timeout){

	return function(scope, element, attrs){

		if (element.find('main').length){

			var w = angular.element($window);

			// make sure modal is structured correctly
			if (element.find('main').length && (element.find('header').length || element.find('footer').length) ){

				// make sure .modal>main is sized properly
				onResize();

				// recalculate overhead upon every resize
				w.bind('resize', onResize);
			}
		}

		function onResize(){

			if (!bottleNaking){

				var bottleNaking = true;

				// only resize modal once in every 100, tops
				$timeout(function(){

					var headerOffsetHeight = element.find('header')[0].offsetHeight;

					if (element.find('header').length){
						element.find('main')[0].style.marginTop = (headerOffsetHeight + 5) + 'px';
					}

					if (element.find('footer').length){
						element.find('main')[0].style.height = (element[0].offsetHeight - headerOffsetHeight - element.find('footer')[0].offsetHeight - 10) + 'px';
					}

					bottleNaking = false;
				}, 100);
			}
		}
	};

}