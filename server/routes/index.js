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
		'/robots.txt',
		serveRobotsFile
	);

	router.get(
		'/sitemap.xml',
		serveSitemap
	);

	router.get(
		/\/google.+\.txt/,
		serveGoogleVerification
	);

	router.get(
		'/alefhebrew.css',
		serveAlefFontRouter
	);

	router.get(
		'/confirm-email/:code',
		validate(validation.confirmEmail),
		auth(),
		confirmEmailCode
	);

	router.get(
		'/add-group',
		redirectToAddGroupModal
	);

};

function getHomepage(req, res){
	var maxAge = process.env.NODE_ENV === 'production' ? 60 * 60 * 1000 : 0;

	res.sendFile('partials/index.html', { root: 'public', maxAge: maxAge });
}

function serveRobotsFile(req, res){
	res.sendFile('robots.txt', { root: 'client', maxAge: 0 });
}

function serveSitemap(req, res){
	res.sendFile('sitemap.xml', { root: 'client', maxAge: 0 });
}

function serveGoogleVerification(req, res){
	res.sendFile('google1d49fa403d712f50.txt', { root: 'client', maxAge: 0 });
}

function serveAlefFontRouter(req, res){
	res.sendFile('alef-font-router.css', { root: 'client', maxAge: 2419200 });
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

function redirectToAddGroupModal(req, res){
	res.redirect('/groups?modal=add-group');
}