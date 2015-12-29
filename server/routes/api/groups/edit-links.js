var log = require('../../../services/log');
var db =    require('../../../services/db');

var _ = require('lodash');

var validUrl = require('valid-url');

module.exports = function(req, res){

	var links = {
		homepage: req.body.homepage,
		facebook: req.body.facebook,
		twitter: req.body.twitter,
		google: req.body.google
	};
	
	_.forIn(links, function(url, propName){
		if (!validUrl.isWebUri(url) && url !== '') delete links[propName];
	});

	var update = { $set: { links: links } };

	db.models.group.findByIdAndUpdate(req.body.groupID, update, function(err){
		if (err){
			log.error(err);

			return res.status(500).end();
		}

		res.status(200).end();
	});
};