var auth = require('../../../middleware/auth');
var validate = require('express-validation');
var validation = require('../validation.js').tasks;

module.exports = function(router){

	router.get(
		'/',
	  require('./get-tasks-list')
	);

	router.post(
		'/',
		auth({ confirmed: 'email', groupAdmin: 'body:groupID' }),
		validate(validation.addTask),
		require('./add-task')
	);

	router.get(
		'/:id',
		require('./get-task-by-id')
	);

	router.put(
		'/:id',
		auth({ groupAdmin: 'body:createdBy' }),
		validate(validation.editTask),
	  require('./edit-task')
	);

	router.delete(
		'/:taskID',
		auth(),
		validate(validation.removeTask),
	  require('./remove-task')
	);

	router.post(
		'/:taskID/volunteer',
		auth(),
		validate(validation.volunteer),
	  require('./volunteer')
	);

	router.post(
		'/:taskID/anon-volunteer',
		validate(validation.anonVolunteer),
	  require('./anon-volunteer')
	);

	router.post(
		'/:taskID/complete',
		auth(),
		validate(validation.complete),
	  require('./task-complete')
	);
};