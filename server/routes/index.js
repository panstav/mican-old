var config =      require('../../common');
var log =         require('../services/log');

var auth =        require('../middleware/auth');
var validation =  require('./validation.js');
var validate =    require('express-validation');

var mongoose =    require('mongoose');
var userModel =   mongoose.model('user');

var moment =      require('moment');

var path =        require('path');
var urls =        require('../helpers/urls');

module.exports = function(router){

	router.get(
		'/',
		getHomepage
	);

	router.get(
		'/confirm-email/:code',
		validate(validation.confirmEmail),
		auth(),
		confirmEmailCode
	);

	function getHomepage(req, res){
		res.sendFile('partials/index.html', { root: 'public', maxAge: 0 });
	}

	function confirmEmailCode(req, res){

		var authCode = req.params.code;

		userModel.findById(req.user._id, function(err, userDoc){
			if (err){
				log.error(err);

				return res.redirect('/');
			}

			if (!userDoc) return res.redirect('/');

			// user doesn't have a code pending, ignore
			if (!userDoc.confirmed.email.code) return res.redirect('/');

			if (authCode !== userDoc.confirmed.email.code){

				// user got here with wrong code, remove pending code
				userDoc.confirmed.email.code = '';
				userDoc.confirmed.email.timeframe = '';

				return res.redirect('/');
			}

			// authCode is correct

			// check whether user got here on time
			if (!moment().isBefore(moment(userDoc.confirmed.email.timeframe, config.timeformat))){

				// user is late with correct code, remove code
				userDoc.confirmed.email.code = '';
				userDoc.confirmed.email.timeframe = '';

				userDoc.save(function(err){
					if (err) log.error(err);

					res.redirect('/');
				});

			} else {

				// user is here on time - remove code, save auth and redirect
				userDoc.confirmed.email.code = '';
				userDoc.confirmed.email.timeframe = '';
				userDoc.confirmed.email.value = true;

				userDoc.save(function(err){
					if (err) log.error(err);

					res.redirect('/');
				});
			}
		});
	}

};