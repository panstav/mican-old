var dialog = require('share-dialog');

module.exports = ['$location', 'domain', 'facebookAppId', Sharer];

function Sharer($location, domain, facebookAppId){

	sharer.supportedPlatforms = [
		'facebook', 'twitter', 'google'
	];

	sharer.callForAction = {
		facebook: 'שתפו',
		twitter: 'צייצו',
		google: 'שתפו'
	};

	return sharer;

	function sharer(platform, shareStr, url){
		if (sharer.supportedPlatforms.indexOf(platform) === -1) return false;

		var url = url || domain + $location.path();

		if (platform === 'facebook')  return dialog.facebook(url).open();

		if (platform === 'twitter')   return dialog.twitter(url, shareStr, 'darkenunet').open();

		if (platform === 'google')    return dialog.gplus(url).open();
	}
}