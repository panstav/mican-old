var log = require('../../../services/log');
var db = require('../../../services/db');

var _ = require('lodash');

module.exports = function(req, res){

	db.models.group.aggregate(
		{ $match: { pending: false, 'blocked.value': false } },
		{ $project: { displayName: 1, color: 1, desc: 1, logo: 1, starredBy: 1, namespace: 1 } },

		function(err, groups){
			if (err) return log.error(err);

			_.each(groups, function(group){

				if (!group.namespace) delete group.namespace;
				if (!group.logo || !group.logo.url) delete group.logo;

				// if this user likes this group, mark it so
				if (req.user && _.contains(group.starredBy, req.user._id.toString())){
					group.starredByUser = true;
				}

				delete group.starredBy;
			});

			res.json(groups);
		}
	);
};