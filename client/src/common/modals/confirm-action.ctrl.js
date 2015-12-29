module.exports = ['modal', 'mem', 'genderize', confirmAction];

function confirmAction(modal, mem, genderize){

	var approveCB = mem('confirmApprovalCallback');
	var cancelCB = mem('confirmCancelationCallback');

	this.genderizedAssurance = genderize({
		male: 'בטוח?',
		female: 'בטוחה?',
		fallback: 'בטוח/ה?'
	});

	this.effect = mem('confirmEffect');

	this.approve = function(){
		modal.reset();

		approveCB();
	};

	this.cancel = function(){
		modal.reset();

		cancelCB();
	}

}
