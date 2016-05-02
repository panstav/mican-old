module.exports = ['mem', controller];

function controller(mem){

	const ctrl = this;

	this.suggestions = mem('paraSuggestions', null, { scoped: true }) || {};

	this.header = numberOf(ctrl.suggestions);

	function numberOf(suggestions){

		if (!suggestions.length) return 'אין הצעות';

		if (suggestions.length === 1) return 'הצעה אחת';

		return suggestions.length + ' הצעות';

	}

}