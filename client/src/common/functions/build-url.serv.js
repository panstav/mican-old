module.exports = [buildUrl];

function buildUrl(){

	return function(base, key, value){
		var prefix = (base.indexOf('?') > -1) ? '&' : '?';
		return base + prefix + key + '=' + value;
	}

}
