var chars = {
	letters: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
	numbers: '0123456789',
	symbols: '`-=[]\\;\',./*+!@#$%^&*()_{}|:"<>?'
};

module.exports = function randomPassword(charNum){

	charNum = charNum || 16;

	var charsDisposal = [chars.letters, chars.numbers];

	var result = '';
	for (var i = 0; i < charNum; i++){

		var charType = charsDisposal[Math.round(Math.random() * (charsDisposal.length - 1))];
		result += charType[Math.round(Math.random() * (charType.length - 1))];

	}

	return result;
};