module.exports = ['$scope', 'mem', 'api', 'pars', groupEvent];

function groupEvent($scope, mem, api, pars){

	var ctrl = this;

	var groupID = mem('groupID');
	var event = mem('eventDetails');

	if (event){

		this.editingExistingTask = true;

		var parsedDate = pars.dates.parseDate(event.date);
		this.year =   parsedDate.year;
		this.month =  parsedDate.month;
		this.day =    parsedDate.day;

		delete event.date;

		this.event = event;
	}

	this.dates = pars.dates;
	this.dates.validateDate = function(){

		var daysInMonthValid =  pars.dates.daysInMonthValidation(ctrl.year, ctrl.month, ctrl.day);
		var dateInPastValid =   pars.dates.futureDateValidation(ctrl.year, ctrl.month, ctrl.day);

		$scope.groupEventForm.eventDay.$setValidity('daysInMonth', daysInMonthValid);
		$scope.groupEventForm.eventDay.$setValidity('dateInPast', dateInPastValid);

	};

	this.submit = function(){

		if ($scope.groupEventForm.$invalid) return ctrl.showValidation = true;

		ctrl.showValidation = false;

		var eventObj = ctrl.event;
		eventObj.date = pars.dates.formatDate(ctrl.year, ctrl.month, ctrl.day);

		api.groups.updateEvent({ method: ctrl.editingExistingTask ? 'put' : 'post', groupID: groupID, eventObj: eventObj });
	}

}