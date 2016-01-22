var dialog = require('share-dialog');

module.exports = ['topLevelData', '$location', Sharer];

function Sharer(topLevelData, $location){

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

		url = url || topLevelData.domain + $location.path();

		if (platform === 'facebook')  return dialog.facebook(url).open();

		if (platform === 'twitter')   return dialog.twitter(url, shareStr).open();

		if (platform === 'google')    return dialog.gplus(url).open();
	}
}