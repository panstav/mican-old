module.exports = ['mem', '$timeout', service];

function service(mem, $timeout){

	var modalUrl = '';

	return { open, reopen, reset, url };

	function open(url, toMemorize){

		// allow some passage of data
		if (angular.isObject(toMemorize)) mem(toMemorize);

		// disable scrolling
		window.document.body.style.overflowY = 'hidden';

		modalUrl = url;
	}

	function reopen(url, toMemorize){
		reset();

		$timeout(() => { open(url, toMemorize) });
	}

	function reset(){

		// enable scrolling
		window.document.body.style.overflowY = 'auto';
		window.document.body.style.position = 'initial';

		modalUrl = '';
	}

	function url(){
		return modalUrl;
	}

}