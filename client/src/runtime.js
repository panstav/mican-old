module.exports = ['$rootScope','$state', '$document', 'modal', 'acticons', 'mem', 'user', runtime];

function runtime($rootScope, $state, $document, modal, acticons, mem, user){

	// check for a pending redirection
	var redirectAfterLogin = mem('continuousRedirection');
	if (redirectAfterLogin) return window.location.href = redirectAfterLogin;

	// attach state to scope for easier access
	$rootScope.$state = $state;

	// handle state-change
	$rootScope.$on('$stateChangeStart', function(event, toState, toParams){

		// dirty fix for '/groups/' instead of '/groups' case
		if (toState.name === 'singleGroup' && !toParams.groupID.length){
			event.preventDefault();
			return $state.go('groups');
		}

		modal.reset();

		// close menu
		$rootScope.$broadcast('menu:close');

	});

	// handle state-changed
	$rootScope.$on('$stateChangeSuccess', function(){

		// reset top bar iconic actions
		acticons.reset();

		// scroll to top
		$document.scrollTopAnimated(0);

	});

	// get user info
	user.recall();

}