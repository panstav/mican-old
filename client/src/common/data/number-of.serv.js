module.exports = [service];

function service(){

	return function numberOf(str, numOf, alterStr){

		const alternative = alterStr || `אין ${str.plural}`;

		if (!numOf) return alternative;

		const num = numOf.length;

		if (num === 0) return alternative;

		if (num === 1) return str.singular;

		return `${num} ${str.plural}`;
	};

}