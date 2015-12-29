var log = require('../../../services/log');

var async = require('async');
var moment = require('moment');

var mongoose = require('mongoose');
var groupModel = mongoose.model('group');
var userModel = mongoose.model('user');
var taskModel = mongoose.model('task');

var publicity = require('../../../helpers/publicity');
var normalizeID = require('../../../helpers/normalize-id');
var paraSplit = require('../../../helpers/para-split');
var validMongoID = require('../../../helpers/valid-mongo-id');

module.exports = function(req, res){

	async.waterfall(
		[

			get_taskDoc_and_validate_publicity,

			tokenize_volunteers_for_groupAdmins,

			attach_createdBy_token,

			createdAt_mod_and_designatedTime

		]
	);

	function get_taskDoc_and_validate_publicity(step){

		if (!validMongoID(req.params.id)) return res.status(403).end();

		taskModel.findById(req.params.id, function(err, taskDoc){
			if (err){
				log.error(err);

				return res.status(500).end();
			}

			if (!taskDoc) return res.status(404).end();

			if (!publicity.predicate(taskDoc.publicity, req.user, taskDoc.createdBy)) return res.status(403).end();

			// only increment task.viewed if user is not the admin of the task
			if (req.user && req.user.isAdmin(normalizeID(taskDoc._id))) return step(null, taskDoc.toObject());

			taskDoc.viewed++;
			taskDoc.save(function(err){
				if (err){
					log.error(err);

					return res.status(500).end();
				}

				step(null, taskDoc.toObject());
			});

		});
	}

	function tokenize_volunteers_for_groupAdmins(taskObj, step){

		if (req.query.volunteertokens === 'true' && req.user && req.user.isAdmin(taskObj.createdBy)){

			// volunteertokens requested by an admin

			var userTokens = taskObj.volunteers
				.filter(nonAnon)
				.map(getID);

			// get tokenized volunteers userDocs
			userModel.findByIdsAndTokenize(userTokens, function(err, tokenizedUsers){
				if (err){
					log.error(err);

					return res.status(500).end();
				}

				taskObj.volunteers.forEach(function(volunteer){

					tokenizedUsers.forEach(function(userToken){

						if (volunteer.volunteerID === normalizeID(userToken._id)){
							extend(volunteer, userToken);
						}

					});

					volunteer.createdAt = moment(volunteer.createdAt, 'X').format('D/M');

					volunteer.message = paraSplit(volunteer.message);

					return volunteer;
				});

				step(null, taskObj);
			})

		} else {

			// either user is not admin or adminView of volunteers was not requested
			delete taskObj.volunteers;
			delete taskObj.publicity;
			delete taskObj.notifyEmail;

			step(null, taskObj);
		}

		function nonAnon(volunteer){
			return volunteer.volunteerID !== 'anon';
		}

		function getID(nonAnonVolunteer){
			return nonAnonVolunteer.volunteerID;
		}

	}

	function attach_createdBy_token(taskObj, step){

		if (req.query.createdbytoken !== 'true') return step(null, taskObj);

		groupModel.findById(taskObj.createdBy, 'displayName namespace', function(err, createdByDoc){
			if (err){
				log.error(err);

				return res.status(500).end();
			}

			if (!createdByDoc) return log.error({ noDoc: createdByDoc, groupID: taskObj.createdBy });

			taskObj.createdByToken = {
				displayName: createdByDoc.displayName,
				link: createdByDoc.namespace || normalizeID(createdByDoc._id)
			};

			step(null, taskObj);
		});

	}

	function createdAt_mod_and_designatedTime(taskObj){

		taskObj.createdAt = moment(taskObj.createdAt, 'X').format('D/M');

		if (taskObj.designatedTime !== 0){

			taskObj.humanDesignatedTime = moment(taskObj.designatedTime, 'X').format(
				moment(taskObj.designatedTime, 'X').format('DD/MM/YYYY HH:mm').indexOf('00:00') === -1 ? 'DD/MM/YYYY HH:mm' : 'DD/MM/YYYY'
			);

		}

		// client already has this value as a sortable unix figure
		delete taskObj.designatedTime;

		res.json(taskObj);
	}

};