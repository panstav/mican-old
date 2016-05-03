module.exports = ['mem', controller];

function controller(mem){

	const ctrl = this;

	this.paraData = mem('paraData') || {};
	this.suggestions = mem('paraSuggestions', null, { scoped: true }) || {};

	this.numberOfSuggestions = addOrNumberOf();

	this.newPara = {
		content: ctrl.paraData.content
	};

	function addOrNumberOf(){

		if (!ctrl.suggestions.length) return 'הוסף הצעת';

		if (ctrl.suggestions.length === 1) return 'הצעה אחת';

		return ctrl.suggestions.length + ' הצעות';

	}

}