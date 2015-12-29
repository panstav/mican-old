module.exports = ['$scope', 'user', 'modal', 'acticons', 'prompts', 'pars', '$timeout', main];

function main($scope, user, modal, acticons, prompts, pars, $timeout){

	var ctrl = this;

	//-=======================================================---
	//------------------ Settings
	//-=======================================================---

	this.user = user;

	// group categories is used at both signNewGroup modal AND groupsController
	// which are both decedents of mainCtrl
	// so this stays here. for now
	this.categories = pars.groupCategoriesByColor;

	this.engCatSlug = function(color){
		return pars.engCategoriesByColor[color];
	};

	// for when menu needs (intuitively) to close, but doesn't
	$scope.$on('menu:close', function(event){
		if (angular.isFunction(event.stopPropagation)) event.stopPropagation();

		ctrl.menuOpen = false;
	});

	//-=======================================================---
	//------------------ Prompt
	//-=======================================================---

	this.prompt = {

		open: function(options){
			ctrl.prompt.toggle = true;
			ctrl.prompt.message = options.message;
			ctrl.prompt.backgroundColor = options.backgroundColor || '';
			ctrl.prompt.color = options.color || '';
			ctrl.prompt.fa = options.fa;

			if (!options.stick) $timeout(ctrl.prompt.reset, 8000);
		},

		reset: function(){
			ctrl.prompt.toggle = false;
			ctrl.prompt.message = '';
			ctrl.prompt.backgroundColor = '';
			ctrl.prompt.color = '';
			ctrl.prompt.fa = '';
		}
	};

	// listeners

	$scope.$on('prompt:open', function(event, options){
		if (angular.isFunction(event.stopPropagation)) event.stopPropagation();

		ctrl.prompt.open(options);
	});

	$scope.$on('prompt:close', function(event){
		if (angular.isFunction(event.stopPropagation)) event.stopPropagation();

		ctrl.prompt.reset();
	});

	$scope.$on('prompt:success', function(event, message){
		if (angular.isFunction(event.stopPropagation)) event.stopPropagation();

		ctrl.prompt.open(
			{
				message: message,
				backgroundColor: '#79F583',
				color: 'white',
				fa: 'check'
			}
		);
	});

	$scope.$on('prompt:error', function(event, message){
		if (angular.isFunction(event.stopPropagation)) event.stopPropagation();

		ctrl.prompt.open(
			{
				message: message,
				backgroundColor: '#FF5A5A',
				color: 'white',
				fa: 'bolt'
			}
		);
	});

	//-=======================================================---
	//------------------ Modal
	//-=======================================================---

	// allow closing modal directly from template
	this.modal = {
		open:   modal.open,
		reset:  modal.reset
	};

	$scope.$watch(modal.url, function(newVal){

		// whether modal is closing or opening - first make sure menu is closed
		ctrl.menuOpen = false;

		ctrl.modal.url = newVal;
	});

	//-=======================================================---
	//------------------ Top Bar Actions
	//-=======================================================---

	ctrl.acticons = acticons;

	//-=======================================================---
	//------------------ Init
	//-=======================================================---

	ctrl.ui = {
		adminingToggle: false,
		followingToggle: false
	};

	ctrl.prompt.reset();

	ctrl.prompts = prompts;

}