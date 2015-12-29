module.exports = ['modal', 'api', feedback];

function feedback(modal, api){

	var ctrl = this;

	this.opinion = {};

	this.fdbkType = 'opinion';

	this.submit = function(){

		var gotFeedback = (
			ctrl.opinion.homepage
			|| ctrl.opinion.groups
			|| ctrl.opinion.volunteering
			|| ctrl.opinion.login
			|| ctrl.opinion.misc
			|| ctrl.bug
			|| ctrl.idea
		);

		if (!gotFeedback) return modal.reset();

		var feedbackObj = {
			url: window.location.href,
			opinion: ctrl.opinion,
			bug: ctrl.bug,
			idea: ctrl.idea
		};

		api.feedback(feedbackObj);
	}

}