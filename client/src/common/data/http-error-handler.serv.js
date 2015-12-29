module.exports = ['$rootScope', 'modal', 'prompts', errorHandler];

function errorHandler($rootScope, modal, prompts){

	return function(data, status, headers, config){

		// 401 Unauthorized
		if (status === 401){
			modal.open('login');
		}

		if (data && data.prompt){

			modal.reset();
			$rootScope.$broadcast('prompt:error', (prompts[data.prompt] || data.prompt))

		}

	}

}