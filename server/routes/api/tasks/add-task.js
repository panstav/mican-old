'use strict';

var log =         require('../../../services/log');

var async =       require('async');
var moment =      require('moment');

var mongoose =    require('mongoose');
var groupModel =  mongoose.model('group');
var taskModel =   mongoose.model('task');

var normalizeID = require('../../../helpers/normalize-id');
var paraSplit =   require('../../../helpers/para-split');

module.exports = function(req, res, next){

	async.waterfall(
		[

			auth_group_and_user,

			create_task,

			add_task_to_group

		],

		function(err){
			if (err){
				log.error(err);

				res.status(500).end();
			}
		}

	);

	function auth_group_and_user(step){

		groupModel.findById(req.body.groupID, 'pending', function(err, groupDoc){
			if (err) return log.error(err);

			if (groupDoc.pending) return res.status(403).end();

			step();
		});
	}

	function create_task(step){

		var newTaskObj = req.body.task;

		newTaskObj.createdAt = moment().unix();
		newTaskObj.createdBy = req.body.groupID;
		newTaskObj.desc = paraSplit(newTaskObj.desc);
		newTaskObj.designatedTime = newTaskObj.designatedTime ? moment(newTaskObj.designatedTime, 'DD/MM/YYYY HH:mm').unix() : 0;

		if (newTaskObj.importance) newTaskObj.importance = paraSplit(newTaskObj.importance);

		taskModel.create(newTaskObj, function(err, newTaskDoc){
			if (err){
				log.error(err);

				return res.status(500).end();
			}

			let taskID = normalizeID(newTaskDoc._id);

			req.track({ cat: 'data-entry', label: 'task', taskID });

			step(null, taskID);
		});
	}

	function add_task_to_group(newTaskID, step){

		groupModel.findByIdAndUpdate(req.body.groupID, { $addToSet: { 'profile.tasks': newTaskID } }, function(err, groupDoc){
			if (err){
				log.error(err);

				return res.status(500).end();
			}

			res.json({ newTaskID: newTaskID, groupID: groupDoc.namespace || normalizeID(groupDoc._id) });
		});
	}

};

