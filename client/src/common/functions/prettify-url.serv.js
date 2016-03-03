module.exports = [service];

function service(){

	return url => {

		const numToSubstr = getUglyCharsNum(url);

		return url.substr(numToSubstr);

	};

	function getUglyCharsNum(str){

		if (str.indexOf('http') > -1){
			if (str.indexOf('https') > -1){
				if (str.indexOf('https://www.') > -1) return 12;

				return 8;
			}

			if (str.indexOf('http://www.') > -1) return 11;

			return 7;
		}

		return 0;
	}

}