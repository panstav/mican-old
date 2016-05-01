module.exports = ['mem', controller];

function controller(mem){

	const ctrl = this;

	this.argument = mem('editArgument', null, { scoped: true }) || {};

}