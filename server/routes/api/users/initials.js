var log = require('../../../services/log');

var mongoose = require('mongoose');
var userModel = mongoose.model('user');
var normalizeID = require('../../../helpers/normalize-id');

module.exports = function(req, res){

	userModel.findById(normalizeID(req.user._id), 'displayName gender', function(err, userDoc){
		if (err){
			log.error(err);

			return res.status(500).end();
		}

		if (!userDoc) return res.status(404).end();

		userDoc.displayName = req.body.displayName;
		userDoc.gender = req.body.gender;

		userDoc.save(function(err){
			if (err){
				log.error(err);

				return res.status(500).end();
			}

			res.status(200).end();
		});

	});

};