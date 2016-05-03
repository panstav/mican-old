module.exports = ['mem', 'numberOf', controller];

function controller(mem, numberOf){

	const ctrl = this;

	this.paraData = mem('paraData') || {};
	this.suggestions = mem('paraSuggestions', null, { scoped: true }) || {};

	this.numberOfSuggestions = function(){
		return numberOf({ singular: 'הצעה אחת', plural: 'הצעות' }, ctrl.suggestions, 'הוסף הצעה')
	};

	this.newPara = {
		content: ctrl.paraData.content
	};

}