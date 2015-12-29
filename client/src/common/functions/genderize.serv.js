module.exports = ['user', genderize];

function genderize(user){

	return function(options){
		return options[user.getGender()] || options.fallback;
	}

}