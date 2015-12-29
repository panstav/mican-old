var log = require('../../../services/log');

var db = require('../../../services/db');
var groupModel = db.models.group;

module.exports = function(req, res){

	var contact = req.body.contact;

	groupModel.update({ _id: req.body.groupID }, { $push: { 'profile.contacts': contact } }, function(err){
		if (err){
			log.error(err);

			return res.status(500).end();
		}

		res.status(201).end();

		var eventObj = {
			ec: 'Data Entry', ea: 'GroupContact'
		};

		req.track.event(eventObj).send();
	});

};