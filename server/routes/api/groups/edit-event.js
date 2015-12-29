var log = require('../../../services/log');

var mongoose =    require('mongoose');
var groupModel =  mongoose.model('group');

var moment = require('moment');

module.exports = function(req, res){

	var groupID = req.body.groupID;

	var eventObj = req.body.event;
	eventObj.date = moment(eventObj.date, 'DD/MM/YYYY').unix();

	var query = { _id: groupID, 'profile.events._id': eventObj._id };
	var action = {
		$set: {

			'profile.events.$.title':   eventObj.title,
			'profile.events.$.date':    eventObj.date,
			'profile.events.$.link':    eventObj.link
		}
	};

	groupModel.update(query, action, function(err){
		if (err){
			log.error(err);

			return res.status(500).end();
		}

		res.status(200).end();
	});
};