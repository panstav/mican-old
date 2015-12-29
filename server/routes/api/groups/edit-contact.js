var log = require('../../../services/log');

var mongoose =    require('mongoose');
var groupModel =  mongoose.model('group');

module.exports = function(req, res){

	var contact = req.body.contact;

	var query = {
		looker: { _id: req.body.groupID, 'profile.contacts._id': contact.id },

		action: {

			$set: {
				'profile.contacts.$.nameOfContact':  contact.nameOfContact,
				'profile.contacts.$.channel':        contact.channel,
				'profile.contacts.$.value':          contact.value,
				'profile.contacts.$.publicity':      contact.publicity
			}

		}
	};

	groupModel.update(query.looker, query.action, function(err){
		if (err){
			log.error(err);

			return res.status(500).end();
		}

		res.status(200).end();
	});
};