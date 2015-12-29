var log = require('../../../services/log');
var async = require('async');

var publicity = require('../../../helpers/publicity');
var generalizeTasks = require('../../../helpers/generalize-tasks.js');

var mongoose = require('mongoose');
var taskModel = mongoose.model('task');

module.exports = function(req, res){

	async.waterfall(
		[

			build_aggregation_object,

			query_tasks_collection

		]
	);

	function build_aggregation_object(step){

		// number of tasks per batch
		var batchSize = 50 + 1;

		// pipe only tasks that match users publicity clearance
		var match = publicity.aggMatcher(req.user, 'createdBy');

		// user might have asked for more tasks
		var skip = req.query.skip ? parseInt(req.query.skip, 10) : 0;

		// category filter
		var showOnlyFromCategory = req.query.color;

		// sorter is designatedTime
		var sortByDesignatedTime = req.query.sorter === 'designatedTime';

		// needy tasks filter
		var showOnlyNonVolunteered = req.query.novolunteers === 'true';

		if (sortByDesignatedTime || showOnlyFromCategory || showOnlyNonVolunteered){

			// extra filters requested, put default matcher insider of array of conditions
			match = { $and: [match] };

			// add extra conditions
			if (sortByDesignatedTime)   match.$and.push({ designatedTime: { $ne: 0 } });
			if (showOnlyFromCategory)   match.$and.push({ color:          req.query.color });
			if (showOnlyNonVolunteered) match.$and.push({ volunteers:     { $size: 0 } });
		}

		var aggArr = [
			{ $match: match },
			{ $project: { createdAt: 1, title: 1, volunteers: 1, designatedTime: 1, color: 1, viewed: 1 } }
		];

		var sortObj = {};
		sortObj[req.query.sorter || 'createdAt'] = req.query.sorter === 'designatedTime' ? 1 : -1;
		aggArr.push({ $sort: sortObj });

		aggArr.push({ $skip: skip }, { $limit: batchSize });

		step(null, batchSize, aggArr);
	}

	function query_tasks_collection(batchSize, aggArr){

		taskModel.aggregate(aggArr, function(err, tasks){
			if (err){
				log.error(err);

				return res.status(500).end();
			}

			var resObj = {};

			if (tasks.length < batchSize){
				resObj.lastBatch = true;

			} else {
				// query returned exact number of documents - remove last in documentsArray to make sure IT is not the last one
				tasks.pop();
			}

			resObj.tasks = generalizeTasks(tasks);

			res.json(resObj);
		});
	}

};