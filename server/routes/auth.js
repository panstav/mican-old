var async =         require('async');
var moment =        require('moment');

var mongoose =      require('mongoose');
var userModel =     mongoose.model('user');
var validMongoID =  require('../helpers/valid-mongo-id');
var normalizeID =   require('../helpers/normalize-id');

var sendMail =      require('../services/email');
var urls =          require('../helpers/urls');
var guid =          require('../helpers/guid');

module.exports = function(router){

	router.get('/login-by-mail', getMailLogin);

	router.post('/login-by-mail', postMailLogin)

};

function getMailLogin(req, res, next){

	var userID =  req.query.userid;
	var code =    req.query.code;

	if (!code || !userID || !validMongoID(userID)) return res.redirect('/');

	userModel.findById(userID, function(err, userDoc){

		if (err) return next({ msg: '#DB.ERROR: Finding @ Auth.loginByMail', err: err, redirect: '/'});

		if (!userDoc || !userDoc.confirmed.linkToMail || !userDoc.confirmed.linkToMail.code) return res.redirect('/');

		var anHourAgo = moment().subtract(1, 'hours').unix();
		var linkToMail = userDoc.confirmed.linkToMail;

		var threeRecentFails = linkToMail.fails.length && linkToMail.fails.every(function(fail){
			return anHourAgo < fail;
		});

		var lateLogin = moment().unix() > linkToMail.timeframe;

		var codeDoesntMatch = linkToMail.code !== code;

		if (threeRecentFails || lateLogin || codeDoesntMatch){

			if (linkToMail.fails.length === 3) userDoc.confirmed.linkToMail.fails.shift();
			userDoc.confirmed.linkToMail.fails.push(moment().unix());

			userDoc.confirmed.linkToMail.code = '';
			userDoc.confirmed.linkToMail.timeframe = 0;

			userDoc.save(function(){ res.redirect('/') });

		} else {

			userDoc.confirmed.linkToMail.code = '';
			userDoc.confirmed.linkToMail.timeframe = 0;

			req.login(userDoc, function(err) {

				if (err){
					res.status(500).end();

					return next({ msg: '#Passport.ERROR: Logging @ Auth.loginByMail', err: err });
				}

				if (userDoc.confirmed.email.value === false){

					userDoc.confirmed.email.value = true;

					userDoc.save(function(){ res.redirect('/') });

				} else {
					res.redirect('/');
				}

				var eventObj = {
					ec: 'API', ea: 'Login', el: 'email'
				};

				req.track.event(eventObj).send();

			});
		}
	});
}

function postMailLogin(req, res, next){

	var userAddress = req.body.address;
	var loginByMailToken = guid(20);

	async.waterfall(
		[

			validate_request,

			send_login_link

		]
	);

	function validate_request(step){

		if (req.user || !userAddress) return res.status(500).end();

		userModel.findOne({ email: userAddress }, 'confirmed', function(err, userDoc){

			if (err){
				res.status(500).end();

				return next({ msg: '#DB.ERROR: Finding @ Auth.sendLinkByMail', err: err });
			}

			if (!userDoc){

				var userObj = {
					email: userAddress,
					displayName: userAddress.substr(0, userAddress.indexOf('@')),
					gender: 'unknown',
					profilePhotoUrl: urls.anonAvatar,
					confirmed: {
						linkToMail: {
							code: loginByMailToken,
							timeframe: moment().add(1, 'hours').unix()
						}
					}
				};

				userModel.create(userObj, function(err, newUserDoc){
					if (err){
						res.status(500).end();

						return next({ msg: '#DB.ERROR: Creating User @ Auth.sendLinkByMail', err: err });
					}

					step(null, normalizeID(newUserDoc._id));
				});

			} else {

				var linkToMail = userDoc.confirmed.linkToMail;
				var anHourAgo = moment().subtract(1, 'hours').unix();

				var threeRecentFails =
					linkToMail.fails &&
					linkToMail.fails.length === 3 &&
					linkToMail.fails.every(function(fail){
					return anHourAgo < fail
				});

				if (threeRecentFails){

					userDoc.confirmed.linkToMail.fails.shift();
					userDoc.confirmed.linkToMail.fails.push(moment().unix());

					userDoc.save(function(){ res.status(403).end() });

				} else {

					userDoc.confirmed.linkToMail.code = loginByMailToken;
					userDoc.confirmed.linkToMail.timeframe = moment().add(1, 'hours').unix();

					userDoc.save(function(err){

						if (err) return step({ msg: '#DB.ERROR: Saving new code & timeframe @ Auth.sendLinkByMail', err: err });

						step(null, normalizeID(userDoc._id));
					});
				}
			}
		});
	}

	function send_login_link(userID, step){

		var mailObj = {
			subject:        'לינק התחברות למערכת',
			recipient:      userAddress,
			importance:     true,
			template:       'linkByMail',
			templateArgs: {
				userID: userID,
				code: loginByMailToken
			}
		};

		sendMail(mailObj, function(err){
			if (err){
				res.status(500).end();

				return step({ msg: '#MAIL.ERROR @ Auth.sendLinkByMail', err: err })
			}

			res.status(200).end();
		});
	}

}