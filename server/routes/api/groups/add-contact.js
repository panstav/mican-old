var log = require('../../../services/log');

var db = require('../../../services/db');
var groupModel = db.models.group;

module.exports = function(req, res){

	var contact = req.body.contact;
	var groupID = req.body.groupID;

	groupModel.update({ _id: groupID }, { $push: { 'profile.contacts': contact } }, function(err){
		if (err){
			log.error(err);

			return res.status(500).end();
		}

		res.status(201).end();

		req.track({ cat: 'data-entry', label: 'contact', groupID });
	});

};