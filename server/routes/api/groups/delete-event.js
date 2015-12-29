var log = require('../../../services/log');

var mongoose =      require('mongoose');
var groupModel =    mongoose.model('group');
var validMongoID =  require('../../../helpers/valid-mongo-id');

module.exports = function(req, res){

	var eventID = req.params.eventID;
	var groupID = req.params.groupID;

	if (!validMongoID(eventID)) return res.status(400).end();

	groupModel.findById(groupID, 'profile', function(err, groupWithEvent){
		if (err){
			log.error(err);

			return res.status(500).end();
		}

		if (!groupWithEvent) return res.status(404).end();

		groupWithEvent.profile.events.pull({ _id: eventID });

		groupWithEvent.save(function(err){
			if (err){
				log.error(err);

				return res.status(500).end();
			}

			log.info({ groupID: groupID }, 'Event Removed');

			res.status(200).end();
		});
	});
};