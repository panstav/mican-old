module.exports = ['$rootScope', '$scope', 'user', 'groups', 'api', 'modal', 'pars', '$filter', '$document', '$location', 'domain', controller];

function controller($rootScope, $scope, user, groups, api, modal, pars, $filter, $document, $location, domain){

	var ctrl = this;

	//-=======================================================---
	//------------------ Category & Search
	//-=======================================================---

	this.filteredOrderedGroups = function(){

		if (!ctrl.groups || !ctrl.groups.length) return false;

		if (ctrl.searchTerm) ctrl.categoryFilter = null;

		var groups = ctrl.groups.filter(groupsFilter);

		if (groups.length === 0){
			ctrl.emptyGroupsList = true;

			return [];
		}
		ctrl.emptyGroupsList = false;

		if (ctrl.searchTerm) return $filter('orderBy')(groups, '-priority +displayName');

		groups = $filter('orderBy')(groups, '+color +displayName');

		var prevCat = null;
		for (var i = 0, len = groups.length; i < len; i++){
			if (groups[i].color !== prevCat){
				groups[i].firstAtCat = true;

				prevCat = groups[i].color;
			}
		}

		return groups;

	};
	
	$scope.$watch(thisSearchTerm, function(newVal, oldVal){

		// if search terms were typed and there weren't any before that
		// reset only the category, without registering seo
		if (!oldVal && !!newVal){
			ctrl.categoryFilter = null;

			// if groups weren't previously copied to model - do it now
			if (!ctrl.groups || !ctrl.groups.length) groups.getAll(function(groups){
				ctrl.groups = groups;
			});
		}

		// if search term is empty
		// wasn't emptied programatically (but with deleting all characters)
		// - reset filter and seo
		if (!newVal && newVal !== null && !!oldVal) ctrl.resetFilter();

	});

	this.resetFilter = function(){

		ctrl.categoryFilter = null;
		ctrl.searchTerm = null;
		ctrl.groups = [];

		nullifyPageLocationAndSEO();

	};

	//-=======================================================---
	//------------------ Category Filter Handles
	//-=======================================================---

	this.filterByCategory = function(categoryColor){

		// groups are loaded, process normally
		if (ctrl.groups) return cleanZoomLoadAndChangeTheCourseOfHistory();

		// get groups, process and then attach groups
		groups.getAll(function(groups){
			cleanZoomLoadAndChangeTheCourseOfHistory();

			ctrl.groups = groups;
		});

		function cleanZoomLoadAndChangeTheCourseOfHistory(){

			// remove search by words
			ctrl.searchTerm = null;

			// start scrolling to results
			var groupsListElement = angular.element(document.getElementsByClassName('groupList')[0]);
			$document.scrollToElementAnimated(groupsListElement, 50, 500);

			// set browser histroy
			$location.search('category', pars.engCategoriesByColor[categoryColor]);
			if (ctrl.categoryFilter) $location.replace();

			// set filter to selected category
			ctrl.categoryFilter = categoryColor;

		}

	};

	//-=======================================================---
	//------------------ Template Handlers
	//-=======================================================---

	this.categoryName = function(colorName){
		return pars.groupCategoriesByColor[colorName];
	};

	this.shortenDesc = function(desc){
		var charLimit = 140;

		var firstPara = desc[0];

		var suffix = firstPara.length >= charLimit ? '...' : '';

		return firstPara.substr(0, charLimit) + suffix;
	};

	//-=======================================================---
	//------------------ Interactions
	//-=======================================================---

	this.keepTerm = function(){
		if (ctrl.searchTerm) api.track.searchTerm({ searchTerm: ctrl.searchTerm, context: 'groupsSearch' });
	};

	//-=======================================================---
	//------------------ Redirection
	//-=======================================================---

	// quick route
	var reqModal = $scope.$state.params.modal;

	if (reqModal && reqModal === 'add-group'){

		// ask for login info asyncly
		// user.recall() is called at app.runtime, but race condition is there
		user.isAnon(function(ans){
			return modal.open(ans ? 'add-group' : 'login');
		});
	}

	var reqCategory = $scope.$state.params.category;
	if (reqCategory) redirectByRequestedCategory(reqCategory);

	//-=======================================================---
	//------------------ Funcs
	//-=======================================================---

	function thisSearchTerm(){
		return ctrl.searchTerm;
	}

	function groupsFilter(group){

		// filter by category, if user chose one
		if (!ctrl.searchTerm) return !ctrl.categoryFilter || group.color === ctrl.categoryFilter;

		var searchTerm = new RegExp(ctrl.searchTerm, 'g');
		var matchAtTitle = group.displayName.match(searchTerm);
		var matchAtDesc, titleScore = 5, descScore = 1, finalScore = 0;

		// check title for search term
		if (matchAtTitle){
			finalScore += matchAtTitle.length * titleScore;
		}

		if (group.desc){ // check desc for search term
			for (var i = 0, len = group.desc.length; i < len; i++){
				matchAtDesc = group.desc[i].match(searchTerm);

				if (matchAtDesc){
					finalScore += matchAtDesc.length * descScore;
				}
			}
		}

		// zero matches at both title & desc - hide this groups
		if (finalScore === 0) return false;

		group.priority = finalScore;
		return true;
	}

	function redirectByRequestedCategory(requestedCategory){

		for (var color in pars.engCategoriesByColor){

			if (pars.engCategoriesByColor[color] === requestedCategory){
				ctrl.filterByCategory(color);

				break;
			}
		}
	}

	function registerSEO(){

		var pageSEO = $scope.$state.current.seo;
		pageSEO.canonical = ctrl.categoryFilter ? domain + $location.path() : null;
		$rootScope.$broadcast('seo:update', pageSEO);

	}
	registerSEO();

	function nullifyPageLocationAndSEO(){
		if ($location.search('category')) return $location.search('category', null);

		registerSEO();
	}

}