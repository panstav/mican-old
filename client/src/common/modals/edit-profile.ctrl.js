module.exports = ['mem', 'user', '$scope', editProfile];

function editProfile(mem, user, $scope){

	var ctrl = this;

	// .modal.editProfile shows up only if user data is initial
	// make sure it doesn't come back for a while..
	mem('reviewedProfile', true);

	this.user = mem('userObj');

	this.genders = [
		{ key: 'female', value: 'נקבה' },
		{ key: 'male', value: 'זכר' },
		{ key: 'unknown', value: 'לא מוגדר/ת' }
	];

	this.uploadProfileImage = function(files){

		if (!files.length) return false;

		var imageIsTooBig = files[0].size > 300 * 1000;

		if (!imageIsTooBig){
			user.updateProfileImage(files[0], function(newProfileImageUrl){

				ctrl.user.profilePhotoUrl = newProfileImageUrl;

			});
		}

		$scope.userProfileForm.$setValidity('imageTooBig', !imageIsTooBig);
	};

	this.submit = function(){

		if ($scope.userProfileForm.$invalid) return ctrl.showValidation = true;

		ctrl.showValidation = false;

		user.updateInitials({
			displayName:  ctrl.user.displayName,
			gender:       ctrl.user.gender
		});
	}

}