var log = require('../../../services/log');
var db =    require('../../../services/db');

var removeInvalidLinks = require('../../../helpers/remove-invalid-links');

module.exports = function(req, res){

	var links = {
		homepage: req.body.homepage,
		facebook: req.body.facebook,
		twitter: req.body.twitter,
		google: req.body.google
	};

	var validLinks = removeInvalidLinks(links);

	var update = { $set: { links: validLinks } };

	db.models.group.findByIdAndUpdate(req.body.groupID, update, function(err){
		if (err){
			log.error(err);

			return res.status(500).end();
		}

		res.status(200).end();
	});
};