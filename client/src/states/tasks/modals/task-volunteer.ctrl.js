module.exports = ['$scope', 'api', 'mem', 'user', taskVolunteer];

function taskVolunteer($scope, api, mem, user){

	var ctrl = this;

	var taskID = mem('volunteerToTask');

	this.anonForm = user.isAnon();

	this.submit = function(){

		if ($scope.taskVolunteerForm.$invalid) return ctrl.showValidation = true;

		ctrl.showValidation = false;

		if (ctrl.anonForm){

			var volunteerObj = {
				fullName: ctrl.volunteer.fullName,
				message: ctrl.volunteer.message,
				contact: {
					channel: 'email',
					value: ctrl.volunteer.email
				}
			};

			return api.tasks.anonVolunteer({ taskID: taskID, anonVolunteer: volunteerObj });
		}

		api.tasks.volunteer({ taskID: taskID, message: ctrl.volunteer.message });
	}
}