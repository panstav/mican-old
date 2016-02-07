var async = require('async');

var mongoose = require('mongoose');
var groupModel = mongoose.model('group');
var userModel = mongoose.model('user');
var taskModel = mongoose.model('task');
var storyModel = mongoose.model('story');

var sendMail = require('../../../services/email');
var urls = require('../../../helpers/urls');
var paraSplit = require('../../../helpers/para-split');

module.exports = function(req, res){

	var uniqueAndRegisteredParticipatorIDs = [];

	async.waterfall(
		[

			auth_user_as_groupAdmin,

			increment_taskCompleted_at_selected_volunteers,

			increment_taskCompleted_and_remove_task_form_group,

			optionally_create_a_story,

			remove_task_from_db,

			notify_volunteers_by_email

		]
	);

	function auth_user_as_groupAdmin(step){

		taskModel.findById(req.params.taskID, 'createdBy volunteers title', function(err, taskDoc){
			if (err){
				log.error(err);

				return res.status(500).end();
			}

			if (!taskDoc) return res.status(404).end();

			if (!req.user.isAdmin(taskDoc.createdBy)) return res.status(403).end();

			// user is app admin or context group admin
			step(null, taskDoc.toObject());
		});

	}

	function increment_taskCompleted_at_selected_volunteers(taskObj, step){

		var participators = req.body.participators;

		if (!participators.length) return step(null, taskObj);

		// gather registered userID list
		var registeredParticipatorIDs = participators.filter(nonAnon);

		// go through this list, and uniquify
		for (var i = 0, len = registeredParticipatorIDs.length; i < len; i++){
			var isUnique = true;

			uniqueAndRegisteredParticipatorIDs.forEach(uniquefy);

			if (isUnique) uniqueAndRegisteredParticipatorIDs.push(registeredParticipatorIDs[i]);
		}

		async.each(uniqueAndRegisteredParticipatorIDs, incrementParticipatorCompletedTasks, function(err){
			if (err){
				log.error(err);

				return res.status(500).end();
			}

			step(null, taskObj);
		});

		function nonAnon(participatorID){
			return participatorID !== 'anon';
		}

		function uniquefy(uniqueVolunteerID){
			if (registeredParticipatorIDs[i] === uniqueVolunteerID){
				isUnique = false;
			}
		}

		function incrementParticipatorCompletedTasks(participatorID, done){
			userModel.findByIdAndUpdate(participatorID, {$inc: {tasksCompleted: 1}}, done);
		}

	}

	function increment_taskCompleted_and_remove_task_form_group(taskObj, step){

		var actions = {
			$pull: { 'profile.tasks': taskObj._id },
			$inc:  { 'profile.tasksCompleted': 1 }
		};

		groupModel.findByIdAndUpdate(taskObj.createdBy, actions, function(err, groupDoc){
			if (err){
				log.error(err);

				return res.status(500).end();
			}

			step(null, taskObj, groupDoc.toObject());
		});
	}

	function optionally_create_a_story(taskObj, groupObj, step){

		if (!req.body.story) return resume();

		var storyObj = {
			createdAt: moment().unix(),
			createdBy: taskObj.createdBy,
			participators: uniqueAndRegisteredParticipatorIDs,
			content: paraSplit(req.body.story)
		};

		storyModel.create(storyObj, function(err){
			if (err) return log.error(err);

			var eventObj = {
				ec: 'New Data', ea: 'Story'
			};

			req.track.event(eventObj).send();

			resume();
		});

		function resume(){
			step(null, taskObj, groupObj);
		}

	}

	function remove_task_from_db(taskObj, groupObj, step){

		taskModel.findByIdAndRemove(taskObj._id, function(err){
			if (err){
				log.error(err);

				return res.status(500).end();
			}

			// all crucial actions taken, user doesn't need to wait anymore
			res.status(200).end();

			step(null, taskObj, groupObj);
		});

	}

	function notify_volunteers_by_email(taskObj, groupObj){

		var uniqueContactableVolunteers = [],

			contactableVolunteers = taskObj.volunteers.filter(contactedByEmail);

		for (var i = 0, len = contactableVolunteers.length; i < len; i++){

			var isUnique = true;

			uniqueContactableVolunteers.forEach(uniquefy);

			if (isUnique) uniqueContactableVolunteers.push(contactableVolunteers[i]);
		}

		async.each(uniqueContactableVolunteers, notifyVolunteer);

		function contactedByEmail(volunteer){
			return volunteer.contact && volunteer.contact.channel === 'email' && volunteer.contact.value;
		}

		function uniquefy(uniqueVolunteer){
			if (contactableVolunteers[i].contact.value === uniqueVolunteer.contact.value){
				isUnique = false;
			}
		}

		function notifyVolunteer(volunteer, done){

			if (!volunteer.contact || volunteer.contact.channel !== 'email') return done();

			var mailObj = {
				subject: 'המשימה "' + taskObj.title + '" השולמה!',
				recipient: volunteer.contact.value,
				importance: false,
				template: 'notifyVolunteersOfTaskCompletion',
				templateArgs: {
					groupDisplayName: groupObj.displayName,
					taskTitle: taskObj.title,
					groupLink: urls.domain + '/groups/' + (groupObj.namespace || groupObj._id)
				}
			};

			sendMail(mailObj, function(err){
				if (err){
					log.error(err);

					return res.status(500).end();
				}

				// we don't want to get held up here, user already received response
				// and at current stage, stories are lux and console is enough
				done();
			});

		}

	}

};

