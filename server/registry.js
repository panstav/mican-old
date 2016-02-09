var log =               require('./services/log');

var async =             require('async');
var request =           require('request');
var md5 =               require('md5');

var mongoose =          require('mongoose');
var userModel =         mongoose.model('user');

var passport =          require('passport');
var FacebookStrategy =  require('passport-facebook').Strategy;
var GoogleStrategy =    require('passport-google-oauth').OAuth2Strategy;

var track =             require('./services/track');
var validMongoID =      require('./helpers/valid-mongo-id');
var urls =              require('./helpers/urls');

module.exports = function(app){

	log.debug('Configuring Passport');

	app.use(passport.initialize());
	app.use(passport.session());

	passport.serializeUser(function(user, done){
		log.trace({ event: 'serializing user', user: user });

		done(null, user._id);
	});

	passport.deserializeUser(function(id, done){
		if (!validMongoID(id)){
			log.warn({ event: 'tried deserializing a non MongoValid userID', id: id });

			return done({ badID: true });
		}

		userModel.findById(id, function(err, userDoc){
			if (err) return log.error({ passport: 'deserializing user', id: id, err: err });

			if (!userDoc) return done(null, false);

			var userObj = userDoc.toObject();

			userObj.isAdmin = isAdmin;

			log.trace({ event: 'deserializing user', id: id });

			done(null, userObj);
		});

	});

	var googleOptions = {
		clientID: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_SECRET,
		callbackURL: urls.domain + '/google/callback'
	};
	passport.use(new GoogleStrategy(googleOptions, oAuthLogin));

	var facebookOptions = {
		clientID: process.env.FACEBOOK_APP_ID,
		clientSecret: process.env.FACEBOOK_SECRET,
		callbackURL: urls.domain + '/facebook/callback'
	};
	passport.use(new FacebookStrategy(facebookOptions, oAuthLogin));

	app.use(require('./middleware/is-admin'));

};

function isAdmin(groupID){

	if (req.user.roles.indexOf('admin') > -1) return true;

	if (groupID && req.user.admining.indexOf(groupID) > -1) return true;

	return false;
}

function oAuthLogin(accessToken, refreshToken, profile, done){

	async.waterfall(
		[

			check_if_user_already_signed_in_with_provider,

			check_if_user_signed_in_with_different_provider,

			create_new_user,

			save_newly_created_user

		],

		function(err){
			log.fatal(err, 'oAuth');
		}
	);

	function check_if_user_already_signed_in_with_provider(step){

		var query = {};
		query[profile.provider + '.id'] = profile.id;

		userModel.findOne(query, function(err, userDoc){
			if (err) return step(err);

			// user has logged in with this provider before - go on
			if (userDoc){
				track(userDoc.toObject())({ cat: 'login', label: profile.provider });

				return done(null, userDoc);
			}

			step();
		})

	}

	function check_if_user_signed_in_with_different_provider(step){

		var query = { email: profile.emails[0].value };

		// user might have signed in with another provider, check for that email address
		userModel.findOne(query, function(err, knownEmailDoc){
			if (err) return step(err);

			if (!knownEmailDoc) return step();

			// got a user with email address
			knownEmailDoc[profile.provider] = {
				accessToken: accessToken,
				id: profile.id,
				link: profile.profileUrl || profile._json.link
			};

			// if newly acquired profile has a photo, and userDoc doesn't have anything - append it
			var picture = profile.picture || profile._json.picture;
			if (!knownEmailDoc.profilePhotoUrl && picture) knownEmailDoc.profilePhotoUrl = picture;

			// done here, save it and go on
			knownEmailDoc.save(function(err){
				if (err) return step(err);

				done(null, knownEmailDoc);
			});
		})
	}

	function create_new_user(step){

		// user wasn't found neither by profile[provider].id nor by his main email address
		// create new user object
		var newUserObj = {
			email: profile.emails.shift().value,
			otherEmails: [],

			profilePhotoUrl: profile.picture || profile._json.picture || '',
			displayName: profile.displayName,
			gender: profile.gender || 'unknown'
		};

		newUserObj[profile.provider] = {
			accessToken: accessToken,
			id: profile.id,
			link: profile.profileUrl || profile._json.link
		};

		// add other emails as well
		var newEmails = profile.emails.map(function(email){ return email.value });
		newUserObj.otherEmails = newUserObj.otherEmails.concat(newEmails);

		if (newUserObj.profilePhotoUrl) return step(null, newUserObj);

		// test for a gravatar
		request.head('https://gravatar.com/' + md5(newUserObj.email) + '.jpg', function(err, res){
			if (err) return step(err);

			newUserObj.profilePhotoUrl = res.statusCode === 200
				? 'https://gravatar.com/avatar/' + md5(newUserObj.email) + '.jpg'
				: urls.anonAvatar;

			step(null, newUserObj);
		})
	}

	function save_newly_created_user(newUserObj){

		userModel.create(newUserObj, function(err, newDoc){
			if (err) return step(err);

			done(null, newDoc);
		});
	}

}