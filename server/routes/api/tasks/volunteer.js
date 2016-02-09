var log = require('../../../services/log');

var async = require('async');
var is = require('is_js');
var moment = require('moment');

var sendMail = require('../../../services/email');
var validMongoID = require('../../../helpers/valid-mongo-id');
var normalizeID = require('../../../helpers/normalize-id');

var mongoose = require('mongoose');
var groupModel = mongoose.model('group');
var taskModel = mongoose.model('task');

module.exports = function(req, res, next){

	async.waterfall(
		[

			validate_task_publicity,

			make_sure_user_hasnt_volunteered_already,

			send_email_if_settings_say_so,

			save_volunteer_at_taskDoc

		]
	);

	function validate_task_publicity(step){

		var taskID = req.params.taskID;

		if (!validMongoID(taskID)) return res.status(403).end();

		taskModel.findById(taskID, 'title publicity createdBy notifyEmail volunteers', function(err, taskDoc){
			if (err){
				log.error(err);

				return res.status(500).end();
			}

			if (!taskDoc) return res.status(404).end();

			// group admin wants to volunteer for his groups task - let it be
			if (req.user.isAdmin(taskDoc.createdBy)) return step(null, taskDoc);

			// user is registered, so public and registered publicity statuses are safe
			if (taskDoc.publicity === 'public' || taskDoc.publicity === 'registered') return step(null, taskDoc);

			// task is for followers only
			if (!is.inArray(taskDoc.createdBy, req.user.starred)) return res.status(403).end();

			step(null, taskDoc);
		});
	}

	function make_sure_user_hasnt_volunteered_already(taskDoc, step){

		var alreadyVolunteered = false;

		taskDoc.volunteers.forEach(checkIfAlreadySigned);

		if (alreadyVolunteered) return res.status(403).json({ alreadyVolunteered: true });

		step(null, taskDoc);

		function checkIfAlreadySigned(volunteer){
			if (volunteer.volunteerID === normalizeID(req.user._id)){
				alreadyVolunteered = true;
			}
		}

	}

	function send_email_if_settings_say_so(taskDoc, step){

		// task is not set to send email upon volunteering, skip this
		if (!taskDoc.notifyEmail.value) return step(null, taskDoc);

		// group might have a namespace
		groupModel.getGroupUrl(taskDoc.createdBy, function(err, groupLink){
			if (err){
				log.error(err);

				return res.status(500).end();
			}

			var mailObj = {
				subject: 'התנדבות חדשה למשימה "' + taskDoc.title + '"',
				recipient: taskDoc.notifyEmail.target,
				importance: true,
				template: 'newVolunteer',
				templateArgs: {
					user: req.user,
					message: req.body.message,
					taskLink: groupLink + '/' + normalizeID(taskDoc._id)
				}
			};

			sendMail(mailObj, function(err){
				if (err){
					log.error(err);

					return res.status(500).end();
				}

				step(null, taskDoc);
			});
		});

	}

	function save_volunteer_at_taskDoc(taskDoc){

		var volunteerObj = {
			volunteerID: req.user._id,
			message: req.body.message,
			createdAt: moment().unix(),
			contact: {
				channel: 'email',
				value: req.user.email
			}
		};

		taskDoc.volunteers.push(volunteerObj);

		taskDoc.save(function(err){
			if (err){
				log.error(err);

				return res.status(500).end();
			}

			req.track({ cat: 'data-entry', label: 'volunteer', taskID: normalizeID(taskDoc._id) });

			res.status(200).end();
		});
	}

};