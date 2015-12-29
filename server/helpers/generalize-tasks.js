var moment = require('moment');

module.exports = function(tasks){

	// plural : singular
	var tasksArr = tasks.length >= 0 ? tasks : [tasks];

	return tasksArr.map(generalizeTask) || false;

};

function generalizeTask(task){

	// human friendly format for date
	task.createdAt = moment(task.createdAt, 'X').format('D/M');

	// remove empty designatedTime
	if (task.hasOwnProperty('designatedTime') && task.designatedTime === 0){
		delete task.designatedTime;
	}

	// only number of volunteers for task-list-view
	if (task.volunteers) task.numVolunteers = task.volunteers.length;
	delete task.volunteers;

	// no reason for it to be available client-side
	delete task.publicity;

	return task;
}