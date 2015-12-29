var hebrewChars = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'כ', 'ך', 'ל', 'מ', 'ם', 'נ', 'ן', 'ס', 'ע', 'פ', 'ף', 'צ', 'ץ', 'ק', 'ר', 'ש', 'ת'];

module.exports = [gotHebrew];

function gotHebrew(){

	return function(str){

		if (typeof(str) !== 'string' || !str.length) return console.error('gotHebrew: Argument is not a string.\nTypeof is: ' + typeof(str));

		var foundHebrew = false;

		for (var i = 0, chars = str.length; i < chars; i++){
			if (hebrewChars.indexOf(str[i]) > -1){
				foundHebrew = true;

				break;
			}
		}

		return foundHebrew;
	}

}