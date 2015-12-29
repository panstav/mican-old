module.exports = ['$scope', 'api', 'mem', 'user', 'modal', 'pars', groupTask];

function groupTask($scope, api, mem, user, modal, pars){

	var ctrl = this;

	var groupObj = mem('groupObj');
	var task = mem('taskDetails');

	//-=======================================================---
	//------------------ Date Picker
	//-=======================================================---

	this.days = pars.dates.days;
	this.months = pars.dates.months;
	this.years = pars.dates.years;
	this.hours = pars.dates.hours;
	this.minutes = pars.dates.minutes;

	this.monthStrings = pars.dates.monthStrings;
	this.numberOfDays = pars.dates.numberOfDays;

	this.validateDate = function(){

		var daysInMonthValid =  pars.dates.daysInMonthValidation(ctrl.taskYear, ctrl.taskMonth, ctrl.taskDay);
		var dateInPastValid =   pars.dates.futureDateValidation(ctrl.taskYear, ctrl.taskMonth, ctrl.taskDay);

		$scope.groupTaskForm.taskDay.$setValidity('daysInMonth',  !ctrl.gotPartialDate() || daysInMonthValid);
		$scope.groupTaskForm.taskDay.$setValidity('dateInPast',   !ctrl.gotPartialDate() || dateInPastValid);

	};

	this.gotPartialDate = function(){
		return (ctrl.taskDay || ctrl.taskMonth || ctrl.taskYear);
	};

	//-=======================================================---
	//------------------ Editorial / Creation
	//-=======================================================---

	// are we editing an existing task?
	if (task){

		// we are
		this.editingExistingTask = true;

		// task desc & importance are displayed as an array of paragraphs, here we display it inside a textarea
		task.desc = task.desc.join('\n\n');
		task.importance = task.importance.join('\n\n');

		// apply to view
		this.task = task;

		if (task.humanDesignatedTime){
			// organize designatedTime into primitive selects
			var parsedDate = pars.dates.parseDate(task.humanDesignatedTime);

			this.taskDay = parsedDate.day;
			this.taskMonth = parsedDate.month;
			this.taskYear = parsedDate.year;

			if (parsedDate.hour){
				this.taskHour = parsedDate.hour;
				this.taskMinutes = parsedDate.minutes;
			}
		}

	} else {

		this.task = {
			requirements: [],
			links: [],
			publicity: 'public',
			notifyEmail: {
				target: user.getEmail(),
				value: true
			}
		}

	}

	//-=======================================================---
	//------------------ Parsers
	//-=======================================================---

	this.publicityTypes = pars.publicityTypes;

	//-=======================================================---
	//------------------ Handlers
	//-=======================================================---

	// Requirement Handlers

	this.addRequirement = function(){

		if ($scope.groupTaskForm.newRequirement.$invalid) return ctrl.showValidation = true;

		ctrl.showValidation = false;

		if (ctrl.newRequirement.length) {

			// push & reset. ignore if empty
			ctrl.task.requirements.push(ctrl.newRequirement);

			ctrl.newRequirement = '';
		}

	};

	this.editRequirement = function(index){

		ctrl.newRequirement = ctrl.task.requirements[index];
		ctrl.task.requirements.splice(index, 1);

	};

	this.removeRequirement = function(index){

		ctrl.task.requirements.splice(index, 1);

	};

	// Link Handlers

	this.addLink = function(){

		var invalidLinkTitleOrValue = $scope.groupTaskForm.newLinkTitle.$invalid || $scope.groupTaskForm.newLinkValue.$invalid;

		if (invalidLinkTitleOrValue) return ctrl.showValidation = true;

		ctrl.showValidation = false;

		if (ctrl.newLink.value.length) {

			// push & reset. ignore if empty

			ctrl.task.links.push(ctrl.newLink);

			ctrl.newLink = {
				title: '',
				value: ''
			}
		}

	};

	this.editLink = function(index){

		ctrl.newLink = ctrl.task.links[index];
		ctrl.task.links.splice(index, 1);

	};

	this.removeLink = function(index){

		ctrl.task.links.splice(index, 1);

	};

	// Submit

	this.submit = function(){

		if ($scope.groupTaskForm.$invalid) return ctrl.showValidation = true;

		ctrl.showValidation = false;

		if (ctrl.gotPartialDate()){

			// parse input time into "DD/MM/YYYY HH:mm" format, if a date was give
			ctrl.task.designatedTime = pars.dates.formatDate(ctrl.taskYear, ctrl.taskMonth, ctrl.taskDay, ctrl.taskHour, ctrl.taskMinutes);

		} else {
			delete ctrl.task.designatedTime;
		}

		// form is un-touched - close modal
		if ($scope.groupTaskForm.$pristine) return modal.reset();

		if (!ctrl.editingExistingTask){
			ctrl.task.color = groupObj.color;

			return api.tasks.sendTask('post', { groupID: groupObj._id, task: ctrl.task });
		}

		var taskObj = {
			title: ctrl.task.title,
			desc: ctrl.task.desc,
			importance: ctrl.task.importance,
			createdBy: ctrl.task.createdBy,
			requirements: ctrl.task.requirements,
			designatedPlace: ctrl.task.designatedPlace,
			duration: ctrl.task.duration,
			links: ctrl.task.links,
			publicity: ctrl.task.publicity,
			notifyEmailValue: ctrl.task.notifyEmail.value
		};

		if (ctrl.task.designatedTime) taskObj.designatedTime = ctrl.task.designatedTime;

		api.tasks.sendTask('put', { taskID: ctrl.task._id, task: taskObj });
	}

}
