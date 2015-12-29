var effectStrings = {

	removeEvent:  'בלחיצה על אישור האירוע ימחק מהמערכת לאלתר.',
	removeTask:   'בלחיצה על אישור הגולשים שהציעו להתנדב למשימה יקבלו מייל אוטומטי על ביטולה והמשימה תמחק לאלתר.'

};

module.exports = ['modal', confirmer];

function confirmer(modal){

	return function(effectName, approval, disapproval){

		if (effectName && angular.isString(effectName) && approval && angular.isFunction(approval)){

			disapproval = angular.isFunction(disapproval) ? disapproval : angular.noop;

			var confirmObj = {
				confirmEffect: effectStrings[effectName] || effectName,
				confirmApprovalCallback: approval,
				confirmCancelationCallback: disapproval
			};

			modal.open('confirm-action', confirmObj);
		}
		
	}

}
