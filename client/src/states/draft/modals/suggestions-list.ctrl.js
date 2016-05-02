module.exports = ['mem', controller];

function controller(mem){

	const ctrl = this;

	this.suggestions = mem('paraSuggestions', null, { scoped: true }) || {};

}