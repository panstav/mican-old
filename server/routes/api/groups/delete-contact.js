var log = require('../../../services/log');

var mongoose =    require('mongoose');
var groupModel =  mongoose.model('group');

module.exports = function(req, res){

	groupModel.findById(req.params.groupID, 'profile', function(err, groupWithContact){
		if (err){
			log.error(err);

			return res.status(500).end();
		}

		if (!groupWithContact){
			log.error(err);

			return res.status(500).end();
		}

		groupWithContact.profile.contacts.pull({ _id: req.params.contactID });

		groupWithContact.save(function(err){
			if (err){
				log.error(err);

				return res.status(500).end();
			}

			log.info({ groupID: req.params.groupID }, 'Contact Removed');

			res.status(200).end();
		});
	});
};