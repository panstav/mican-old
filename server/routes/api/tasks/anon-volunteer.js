var log =           require('../../../services/log');

var async =         require('async');
var moment =        require('moment');

var mongoose =      require('mongoose');
var groupModel =    mongoose.model('group');
var taskModel =     mongoose.model('task');

var sendMail =      require('../../../services/email');
var validMongoID =  require('../../../helpers/valid-mongo-id');
var normalizeID =   require('../../../helpers/normalize-id');

module.exports = function(req, res){

	async.waterfall(
		[

			validate_task_publicity,

			send_email_if_settings_say_so,

			save_volunteer_at_taskDoc

		]
	);

	function validate_task_publicity(step){

		var taskID = req.params.taskID;

		if (!validMongoID(taskID)) return res.status(403).end();

		taskModel.findById(taskID, 'publicity notifyEmail createdBy title volunteers', function(err, taskDoc){
			if (err){
				log.error(err);

				return res.status(500).end();
			}

			if (!taskDoc) return res.status(404).end();

			// for anons, the only valid publicity setting is public
			if (taskDoc.publicity !== 'public') return res.status(403).end();

			step(null, taskDoc);
		});
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
				subject: 'התנדבות אנונימית חדשה למשימה "' + taskDoc.title + '"',
				recipient: taskDoc.notifyEmail.target,
				importance: true,
				template: 'newAnonVolunteer',
				templateArgs: {
					anon: req.body,
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

		taskDoc.volunteers.push({
			volunteerID: 'anon',
			anonFullName: req.body.fullName,
			contact: req.body.contact,
			message: req.body.message,
			createdAt: moment().unix()
		});

		taskDoc.save(function(err){
			if (err){
				log.error(err);

				return res.status(500).end();
			}

			res.status(200).end();

			var eventObj = {
				ec: 'New Data', ea: 'AnonVolunteer'
			};

			req.track.event(eventObj).send();
		});
	}

};

