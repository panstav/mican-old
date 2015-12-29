module.exports = [stopPropagation];

function stopPropagation(){

	return function(scope, element, attrs){

		element.bind('click', function (e){
			e.stopPropagation();
		});

		element.bind('touchend', function (e){
			e.stopPropagation();
		});

	}

}