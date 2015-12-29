module.exports = ['gotHebrew', alignByLang];

function alignByLang(gotHebrew){

	return {

		restrict: 'A',

		link: function linkFn(scope, element, attrs){

			$timeout(function(){

				element[0].style.direction = gotHebrew(element[0].innerText) ? 'rtl' : 'ltr';

			}, 0);

		}

	}

}