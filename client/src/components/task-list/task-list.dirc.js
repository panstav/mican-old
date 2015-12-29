var template = require('./task-list.jade');

module.exports = ['api', 'pars', '$document', taskList];

function taskList(api, pars, $document){

	return {
		controllerAs: 'tList',
		controller: ['$scope', controller],

		scope: {
			tasks: '=',
			includeVolunteers: '=',
			editingMode: '=showEditButtons',
			openInit: '='
		},

		template: template,
		restrict: 'E',

		link: linkFn
	};

	function controller($scope){

		//-=======================================================---
		//------------------ Parsers
		//-=======================================================---

		this.webOrFacebookIcon = pars.webOrFacebookIcon;

		this.trimMax = pars.trimMax;

		this.hexColorByName = pars.hexColorByName;

		//-=======================================================---
		//------------------ Handlers
		//-=======================================================---

		this.toggleTaskDetails = function(task, callback){

			callback = callback || angular.noop;

			if (task.open !== undefined){
				task.open = !task.open;

				return callback();
			}

			task.loading = true;

			api.tasks.getDetails({ taskID: task._id, volunteerTokens: $scope.includeVolunteers }, function(detailedTask){

				task.loading = false;

				detailedTask.volunteers = detailedTask.volunteers || [];

				detailedTask.volunteers.forEach(function(volunteer){
					var nice = 0;

					if (volunteer.volunteerID !== 'anon') nice++;
					if (volunteer.profilePhotoUrl) nice++;

					volunteer.niceness = nice;

					return volunteer;
				});

				angular.extend(task, detailedTask);

				task.open = !task.open;

				callback();
			});

		};

		this.editTask = function(task){
			modal.open('group-task', { taskDetails: task });
		};

		this.complete = function(task){
			modal.open('complete-task', { volunteers: task.volunteers, taskID: task._id });
		};

		this.volunteer = function(taskID){
			modal.open('task-volunteer', { volunteerToTask: taskID });
		};

		this.removeTask = function(taskID){
			api.tasks.removeTask({ taskID: taskID });
		};

	}

	function linkFn(scope, element, attrs, ctrl){

		if (scope.openInit){

			for (var i = 0, len = scope.tasks.length; i < len; i++){

				if (scope.tasks[i]._id === scope.openInit){

					ctrl.toggleTaskDetails(scope.tasks[i], function(){
						$document.scrollToElementAnimated( element, 100 );
					});

					break;
				}
			}
		}
	}

}