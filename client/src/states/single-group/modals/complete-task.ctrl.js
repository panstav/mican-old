module.exports = ['$scope', 'mem', 'api', completeTask];

function completeTask($scope, mem, api){

	var ctrl = this;

	var taskID = mem('taskID') || [];

	ctrl.volunteers = mem('volunteers');

	this.submit = function(){

		if ($scope.completeTaskForm.$invalid) return ctrl.showValidation = true;

		ctrl.showValidation = false;

		var participators = ctrl.volunteers
				.filter(function(volunteer){ return volunteer.participated })
				.map(function(volunteer){ return volunteer.volunteerID });

		var completionObj = { taskID: taskID, participators: participators };

		if (ctrl.story) completionObj.story = ctrl.story;

		api.tasks.completeTask(completionObj);
	}

}