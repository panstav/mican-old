module.exports = ['mem', service];

function service(mem){

	var modalUrl = '';

	return {

		open: function(url, toMemorize){

			// allow some passage of data
			if (angular.isObject(toMemorize)) mem(toMemorize);

			// disable scrolling
			window.document.body.style.overflowY = 'hidden';

			modalUrl = url;
		},

		reset: function(){

			// enable scrolling
			window.document.body.style.overflowY = 'auto';
			window.document.body.style.position = 'initial';

			modalUrl = '';
		},

		url: function(){
			return modalUrl;
		}

	};

}