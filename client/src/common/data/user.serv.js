module.exports = ['$rootScope', 'api', 'modal', 'track', user];

function user($rootScope, api, modal, track){

	var userInfo;

	var userAgent = navigator.userAgent ? navigator.userAgent.toLowerCase() : '';
	var appVersion = navigator.appVersion ? navigator.appVersion.toLowerCase() : '';
	var uaTests = {
		iphone: function(){
			return /iphone/i.test(userAgent)
		},
		ipod: function() {
			return /ipod/i.test(userAgent)
		},
		androidPhone: function() {
			return /android/i.test(userAgent) && /mobile/i.test(userAgent);
		},
		blackberry: function() {
			return /blackberry/i.test(userAgent) || /BB10/i.test(userAgent);
		},
		windows: function() {
			return /win/i.test(appVersion);
		},
		windowsPhone: function() {
			return uaTests.windows() && /phone/i.test(userAgent);
		}
	};

	return {

		//-=======================================================---
		//------------------ Get & Post
		//-=======================================================---

		recall: function(){

			api.recall(function(data){
				if (!data || !data.user){
					userInfo = null;

					return;
				}

				userInfo = data.user;

				var hasntEditedProfileRecently =  !window.localStorage.getItem('reviewedProfile');
				var displayNameIsAuto =           userInfo.displayName === userInfo.email.substr(0, userInfo.email.indexOf('@'));
				var avatarIsAnonymous =           userInfo.profilePhotoUrl === 'https://s3.eu-central-1.amazonaws.com/mican/misc/anon-avatar.png';
				var genderIsUnknown =             userInfo.gender === 'unknown';

				if (hasntEditedProfileRecently && displayNameIsAuto && avatarIsAnonymous && genderIsUnknown){
					openProfileEditingModal();
				}

				track.setUser(userInfo.id);
			});

		},

		apply: function(info){
			userInfo = info;
		},

		isAnon: function(callback){

			// treat undefined (unchecked) and null (confirmed anon) the same
			if (!callback) return !userInfo;
			
			// suppose userInfo is not necessarily available
			var deregister = $rootScope.$watch(function(){ return userInfo }, function(newVal){

				// recall assigns null upon empty response to indicate that there was a response
				if (angular.isUndefined(newVal)) return;

				deregister();

				callback(newVal);
			});
		},

		get isAdmin(){
			return userInfo && userInfo.isAdmin;
		},

		editProfile: function(){
			openProfileEditingModal();
		},

		updateInitials: function(newProfileObject){

			api.users.updateInitials(newProfileObject, function(){

				userInfo.displayName = newProfileObject.displayName;
				userInfo.gender = newProfileObject.gender;

			});

		},

		logout: function(){
			api.users.logout();
		},

		//-=======================================================---
		//------------------ Handlers
		//-=======================================================---

		starToggle: function(groupID, callback){

			api.groups.star({ groupID: groupID }, function(data){

				var deStarred = false;

				for (var i = 0, len = userInfo.following.length; i < len; i++){
					if (userInfo.following[i]._id === groupID){

						deStarred = i;

						break;
					}
				}

				if (angular.isNumber(deStarred)){
					userInfo.following.splice(i, 1);

				} else {
					userInfo.following.push(data.groupToken);
				}

				callback();
			});

		},

		updateProfileImage: function(image, callback){

			api.upload(image, 'profile-image', function(data){

				userInfo.profilePhotoUrl = data.newProfilePhotoUrl;

				callback(userInfo.profilePhotoUrl);

			});

		},

		createGroup: function(groupObj){

			api.groups.create(groupObj, !groupObj.amAdmin ? angular.noop : function(data){

				var groupObj = {
					_id: data._id,
					link: data._id,
					displayName: groupObj.displayName
				};

				userInfo.admining.push(groupObj);

			});

		},

		//-=======================================================---
		//------------------ Public Properties
		//-=======================================================---

		get firstName(){
			if (!userInfo) return null;

			if (userInfo.displayName.indexOf(' ') === -1) return userInfo.displayName;

			return userInfo.displayName.substr(0, userInfo.displayName.indexOf(' '));
		},

		hasConfirmed: function(confirmation){
			if (!this.isAnon()){
				return userInfo.confirmed[confirmation] || false;
			}
		},

		getDisplayName: function(){
			if (!this.isAnon()){
				return userInfo.displayName;
			}
		},

		getEmail: function(){
			if (!this.isAnon()){
				return userInfo.email;
			}
		},

		getProfileUrl: function(){
			if (!this.isAnon()){
				return userInfo.profilePhotoUrl;
			}
		},

		get admining(){
			if (!this.isAnon()){
				return userInfo.admining;
			}
		},

		get following(){
			return this.isAnon() ? [] : userInfo.following;
		},

		getGender: function(){
			if (!this.isAnon()){
				return userInfo.gender || null;
			}
		},

		get isMobile(){
			return uaTests.iphone() || uaTests.ipod() || uaTests.androidPhone() || uaTests.blackberry() || uaTests.windowsPhone();
		}

	};

	function openProfileEditingModal(){

		var userObj = {
			displayName: userInfo.displayName,
			gender: userInfo.gender,
			profilePhotoUrl: userInfo.profilePhotoUrl
		};

		modal.open('edit-profile', { userObj: userObj });
	}

}