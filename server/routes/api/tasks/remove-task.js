var log = require('../../../services/log');

var async = require('async');
var is = require('is_js');

var mongoose = require('mongoose');
var groupModel = mongoose.model('group');
var taskModel = mongoose.model('task');

var sendMail = require('../../../helpers/send-mail');
var validMongoID = require('../../../helpers/valid-mongo-id');
var urls = require('../../../helpers/urls');
var normalizeID = require('../../../helpers/normalize-id');

module.exports = function(req, res, next){

	async.waterfall(
		[

			validate_taskID_and_auth_user,

			remove_task_from_db,

			collect_unique_volunteer_emails,

			fetch_group_url,

			send_cancelation_emails

		]
	);

	function validate_taskID_and_auth_user(step){

		var taskID = req.params.taskID;

		if (!validMongoID(taskID)) return res.status(403).end();

		taskModel.findById(taskID, 'createdBy volunteers title', function(err, taskDoc){
			if (err){
				log.error(err);

				return res.status(500).end();
			}

			if (!taskDoc) return res.status(404).end();

			if (!req.user.isAdmin(taskDoc.createdBy)) return res.status(403).end();

			step(null, taskDoc);
		});
	}

	function remove_task_from_db(taskDoc, step){

		taskDoc.remove(function(err){
			if (err){
				log.error(err);

				return res.status(500).end();
			}

			// crucial actions completed - respond to user
			res.status(200).end();

			step(null, taskDoc.toObject());
		})
	}

	function collect_unique_volunteer_emails(taskObj, step){

		var uniqueEmails = [];

		for (var i = 0, len = taskObj.volunteers.length; i < len; i++){

			var volunteer = taskObj.volunteers[i];
			var currentEmail = volunteer.contact.value;

			if (volunteer.contact.channel === 'email' && currentEmail){
				if (!is.inArray(currentEmail, uniqueEmails)) uniqueEmails.push(currentEmail)
			}
		}

		step(null, taskObj, uniqueEmails);
	}

	function fetch_group_url(taskObj, uniqueEmails, step){

		groupModel.findById(taskObj.createdBy, 'displayName namespace', function(err, groupDoc){
			if (err) return log.error(err);

			if (groupDoc) step(null, groupDoc.toObject(), taskObj, uniqueEmails);
		});

	}

	function send_cancelation_emails(groupObj, taskObj, uniqueEmails){

		async.each(uniqueEmails, sendCancelationEmails, function(err){
			if (err) return log.error(err);
		});

		function sendCancelationEmails(volunteerAddress, done){

			var mailObj = {
				subject: 'המשימה "' + taskObj.title + '" בוטלה!',
				recipient: volunteerAddress,
				importance: false,
				template: 'notifyVolunteersOfTaskCancelation',
				templateArgs: {
					groupDisplayName: groupObj.displayName,
					taskTitle: taskObj.title,
					groupLink: urls.domain + '/groups/' + (groupObj.namespace || normalizeID(groupObj._id))
				}
			};

			sendMail(mailObj, done);
		}

	}

};