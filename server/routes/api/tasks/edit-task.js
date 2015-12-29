var log =           require('../../../services/log');

var async =         require('async');
var moment =        require('moment');

var mongoose =      require('mongoose');
var groupModel =    mongoose.model('group');
var taskModel =     mongoose.model('task');

var sendMail =      require('../../../helpers/send-mail');
var validMongoID =  require('../../../helpers/valid-mongo-id');
var urls =          require('../../../helpers/urls');
var normalizeID =   require('../../../helpers/normalize-id');
var paraSplit =     require('../../../helpers/para-split');

module.exports = function(req, res){

	async.waterfall(
		[

			update_taskDoc,

			optionally_inform_volunteers

		]
	);

	function update_taskDoc(step){

		if (!validMongoID(req.params.id)) return res.status(500).end();

		var update = {
			$set: {

				'title':              req.body.title,
				'desc':               paraSplit(req.body.desc) || [],
				'importance':         paraSplit(req.body.importance) || [],
				'requirements':       req.body.requirements || [],
				'designatedPlace':    req.body.designatedPlace || '',
				'designatedTime':     req.body.designatedTime ? moment(req.body.designatedTime, 'DD/MM/YYYY HH:mm').unix() : 0,
				'duration':           req.body.duration || '',
				'links':              req.body.links || [],
				'publicity':          req.body.publicity,
				'notifyEmail.value':  req.body.notifyEmailValue

			}
		};

		taskModel.findByIdAndUpdate(req.params.id, update, function(err, taskDoc){
			if (err){
				log.error(err);

				return res.status(500).end();
			}

			res.status(200).end();

			step(null, taskDoc.toObject());
		});
	}

	function optionally_inform_volunteers(taskObj){

		groupModel.findById(taskObj.createdBy, 'displayName namespace', function(err, groupDoc){
			if (err) log.error(err);

			if (!groupDoc) return log.error({ noDoc: groupDoc, groupID: taskObj.createdBy });

			var volunteers = taskObj.volunteers || [];
			if (volunteers.length){

				async.eachLimit(volunteers, 1, notifyVolunteer, function(err){
					if (err) log.error(err);
				});
			}

			function notifyVolunteer(volunteer, done){

				if (volunteer.contact && volunteer.contact.value){

					var mailObj = {
						subject: 'המשימה "' + taskObj.title + '" עודכנה',
						recipient: volunteer.contact.value,
						importance: true,
						template: 'notifyVolunteersOfTaskUpdate',
						templateArgs: {
							groupTitle: groupDoc.displayName,
							taskTitle: taskObj.title,
							taskLink: urls.domain + 'groups/' + (groupDoc.namespace || groupDoc._id) + '/' + normalizeID(taskObj._id)
						}
					};

					sendMail(mailObj, done);
				}
			}

		});
	}

};