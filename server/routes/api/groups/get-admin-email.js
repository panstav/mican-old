var db = require('../../../services/db');
var log = require('../../../services/log');

module.exports = function(req, res){

	// get admins list of requested group
	db.models.group.findById(req.params.id, 'admins', function(err, groupDoc){
		if (err) return log.error(err);

		if (!groupDoc.admins || !groupDoc.admins.length) return res.json({ adminEmail: null });

		// get first-ish admins email
		db.models.user.findById(groupDoc.admins[0], 'email', function(err, adminDoc){
			if (err) return log.error(err);

			if (!adminDoc || !adminDoc.email) return res.json({ adminEmail: null });

			// send it back
			res.json({ adminEmail: adminDoc.email });
		});
	});
};