var mongoose =    require('mongoose');
var groupModel =  mongoose.model('group');

var moment =      require('moment');

module.exports = function(req, res, next){

	var groupID = req.body.groupID;

	var eventObj = req.body.event;
	eventObj.date = moment(eventObj.date, 'DD/MM/YYYY').unix();

	groupModel.findByIdAndUpdate(groupID, { $addToSet: { 'profile.events': eventObj } }, function(err){
		if (err){
			log.error(err);

			return res.status(500).end();
		}

		res.status(200).end();

		req.track({ cat: 'data-entry', label: 'event', eventTitle: req.body.event.title });
	});
};