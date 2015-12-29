module.exports = ['modal', 'pars', 'prompts', controller];

function controller(modal, pars, prompts){

	this.reset = modal.reset;

	this.categories = pars.groupCategoriesByColor;

	this.prompts = {
		saveButton:   prompts.saveButton,
		sendForm:     prompts.sendForm,
		invalidField: prompts.invalidField
	};

}