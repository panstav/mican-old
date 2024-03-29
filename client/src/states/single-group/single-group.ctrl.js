module.exports = ['$scope', 'user', 'api', 'modal', 'acticons', 'sharer', 'pars', 'prompts', 'prettifyUrl', singleGroup];

function singleGroup($scope, user, api, modal, acticons, sharer, pars, prompts, prettifyUrl){

	var ctrl = this;

	this.group = $scope.singleGroupState.group;

	var seo = {
		title: this.group.displayName,
		description: this.group.desc[0]
	};

	if (this.group.logo) seo.image = this.group.logo.url;

	$scope.$emit('seo:update', seo);

	this.group.starredByUser = false;
	user.following.forEach(function(followed){
		if (followed._id === ctrl.group._id) ctrl.group.starredByUser = true;
	});

	this.editingMode = $scope.$state.params.editingMode;

	// if user has the privilege - set the editingMode acticon
	if (this.group.userIsAdmin) addEditModeActicon();

	//-=======================================================---
	//------------------ Parsers
	//-=======================================================---

	this.contactChannelFaClass = pars.contactChannelFaClass;

	this.contactChannelTitle = pars.contactChannels;

	this.formatLinkProtocol = pars.formatLinkProtocol;

	this.trimMax = pars.trimMax;

	//-=======================================================---
	//------------------ Admin
	//-=======================================================---

	this.categories = $scope.$root.main.categories;
	this.newCategory = this.group.color;
	this.changeCategory = () => {
		if (ctrl.newCategory !== ctrl.group.color){

			api.admin.updateGroupCategory({ groupId: ctrl.group._id, newCategory: ctrl.newCategory })

		}
	};

	this.newNamespace = this.group.namespace || this.group._id;
	this.updateNamespace = () => {
		 api.admin.updateGroupNamespace({ groupId: ctrl.group._id, newNamespace: ctrl.newNamespace })
	};

	this.authorizeGroup = () => {

		 api.admin.authorizeGroup({ groupId: ctrl.group._id })

	};

	//-=======================================================---
	//------------------ Handlers
	//-=======================================================---

	this.prettifyUrl = prettifyUrl;

	this.dev = function(){
		return (ctrl.editingMode && ctrl.group.userIsAdmin);
	};

	this.styleHeroHolder = function(heroUrl){
		return heroUrl ? '' : { 'height': '1px' };
	};

	this.styleHero = function(heroUrl){
		return heroUrl ? { 'background-image': 'url(' + heroUrl + ')' } : '';
	};

	this.uploadImage = function(type, files){

		var maxSize = {
			hero: 1000 * 1000,  // 1mb
			logo: 300 * 1000    // 300kb
		};

		if (files.length){
			if (files[0].size > maxSize[type]) return $scope.$emit('prompt:error', prompts.imageTooBig);

			api.upload(files[0], type, { groupID: ctrl.group._id }, $scope.$state.reload);
		}
	};

	this.editLinks = function(){

		modal.open('group-links', { groupID: ctrl.group._id, groupLinks: ctrl.group.links });

	};

	this.starToggle = function(){

		user.starToggle(ctrl.group._id, function(){
			ctrl.group.starredByUser = !ctrl.group.starredByUser;
		});

	};

	this.addEvent = function(){

		modal.open('group-event', { groupID: ctrl.group._id });

	};

	this.editEvent = function(event){

		modal.open('group-event', { groupID: ctrl.group._id, eventDetails: event });

	};

	this.removeEvent = function(eventID){

		api.groups.removeEvent({ groupID: ctrl.group._id, eventID: eventID });

	};

	this.addContact = function(){

		modal.open('group-contact', { groupID: ctrl.group._id });

	};

	this.editContact = function(contact){

		modal.open('group-contact', { groupID: ctrl.group._id, contactDetails: contact });

	};

	this.addTask = function(){

		modal.open('group-task', { groupObj: ctrl.group });

	};

	function addEditModeActicon(){

		acticons.addForState(
			{
				toggle: true,
				init: ctrl.editingMode,
				fa: 'pencil',
				title: 'מצב עריכה',
				action: function(){
					ctrl.editingMode = !ctrl.editingMode;
				}
			}
		);

	}

}