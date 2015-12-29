var db = require('../../../services/db');
var log = require('../../../services/log');

var moment = require('moment');

module.exports = function(req, res){

	var query = { pending: true };
	var projection = 'displayName createdAt pending namespace';
	var opts = { sort: { createdBy: -1 }, limit: 30 };

	db.models.group.find(query, projection, opts, function(err, docs){
		if (err) return log.error(err);

		// if empty simply return empty list
		if (!docs || !docs.length) return res.json({ pendingGroups: [] });

		// prep for submission
		var pendingGroups = docs.map(plainObjectWithProperProps);

		res.json({ pendingGroups: pendingGroups });
	});

	function plainObjectWithProperProps(doc){

		// transform to plain object
		var docObj = doc.toObject();

		// set createdAt to humanized
		docObj.createdAt = moment(docObj.createdAt, 'X').format('D/M');

		// set url to groups
		docObj.namespace = docObj.namespace || docObj._id;

		return docObj;
	}

};