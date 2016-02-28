var log =         require('../../services/log');

var async =       require('async');
var mailchimp =   require('mailchimp-api');
var is =          require('is_js');

var mongoose =    require('mongoose');
var groupModel =  mongoose.model('group');

var sendMail =    require('../../services/email');
var normalizeID = require('../../helpers/normalize-id');
var urls =        require('../../helpers/urls');

module.exports = function(router){

	router.get('/recall', recallUser);

	router.post('/add-to-newsletter', addToNewsletter);

	router.post('/feedback', postFeedback);

	router.post('/track/search-term', postTrack);

};

function recallUser(req, res){

	async.waterfall(
		[

			dismiss_anonymous_users,

			arrange_admined_and_followed_groups,

			construct_user_obj

		]
	);

	function dismiss_anonymous_users(step){
		if (!req.user) return res.json({ user: undefined });

		step(null, req.user);
	}

	function arrange_admined_and_followed_groups(userDoc, step){

		async.parallel(
			[

				admined,

				followed

			],

			function(err, results){
				if (err) return log.error(err);

				step(null, userDoc, results[0], results[1]);
			}
		);

		function admined(done){

			groupModel.find({ _id: { $in: userDoc.admining }}, 'displayName namespace pending', function(err, groups){
				if (err) done(err);

				if (!groups.length) return done(null, []);

				var adminedGroups = groups.map(function(group){
					var _id = normalizeID(group._id);

					return { _id: _id, displayName: group.displayName, link: group.namespace || _id };
				});

				done(null, adminedGroups);
			});

		}

		function followed(done){

			groupModel.find({ _id: { $in: userDoc.starred }}, 'displayName namespace pending', function(err, groups){
				if (err) done(err);

				var followedGroups = groups.filter(function(group){ return !group.pending }).map(function(group){
					var _id = normalizeID(group._id);

					return { _id: _id, displayName: group.displayName, link: group.namespace || _id };
				});

				done(null, followedGroups);
			});
		}

	}

	function construct_user_obj(userDoc, adminedGroups, followedGroups){

		var userObj = {
			id: userDoc._id,

			email: userDoc.email,
			displayName: userDoc.displayName,
			gender: userDoc.gender,
			profilePhotoUrl: userDoc.profilePhotoUrl,

			isAdmin: userDoc.roles.indexOf('admin') > -1,

			admining: adminedGroups || [],
			following: followedGroups || [],

			confirmed: {
				email: userDoc.confirmed.email.value
			}
		};

		if (userDoc.profilePhotoUrl) userObj.photo = userDoc.profilePhotoUrl;

		res.json({ user: userObj });
	}
}

function numPendingGroups(req, res){

	groupModel.count({ pending: true }, function(err, numPending){
		if (err){
			log.error(err);

			return res.status(500).end();
		}

		res.json({ numPending: numPending });
	});

}

function addToNewsletter(req, res){

	async.waterfall(
		[
			validate_request,

			subscribe_to_newsletter
		]
	);

	function validate_request(step){

		if (!req.body.email) return res.status(400).end();

		if (is.not.email(req.body.email)) return res.status(403).end();

		step();
	}

	function subscribe_to_newsletter(){

		var mailchimpApi = new mailchimp.Mailchimp(process.env.MAILCHIMP_API_KEY);

		var subscriptionObj = {
			id: process.env.MAILCHIMP_MICAN_LISTID,
			email: { email: req.body.email }
		};

		mailchimpApi.lists.subscribe(subscriptionObj, successfulCallback, failureCallback);

		function successfulCallback(data){
			log.info(data, 'User Subscribed to Newsletter');

			res.status(200).end();
		}

		function failureCallback(err){
			log.error(err);

			if (err.code === 214) return res.status(403).json({ prompt: 'כתובת מייל זו כבר ישנה ברשימה התפוצה.' });

			res.status(500).end();
		}
	}
}

function postFeedback(req, res){

	var feedbackObj = req.body;

	// make sure each one of these has a value (just to avoid sending undefined values)
	feedbackObj.opinion =               feedbackObj.opinion || '';
	feedbackObj.opinion.homepage =      feedbackObj.opinion.homepage || '';
	feedbackObj.opinion.groups =        feedbackObj.opinion.groups || '';
	feedbackObj.opinion.volunteering =  feedbackObj.opinion.volunteering || '';
	feedbackObj.opinion.login =         feedbackObj.opinion.login || '';
	feedbackObj.opinion.misc =          feedbackObj.opinion.misc || '';
	feedbackObj.bug =                   feedbackObj.bug || '';
	feedbackObj.idea =                  feedbackObj.idea || '';
	feedbackObj.useragent =             req.headers['user-agent'];

	var mailObj = {
		subject: 'פידבק חדש',
		recipient: urls.supportAddress,
		importance: false,
		template: 'feedback',
		templateArgs: feedbackObj
	};

	if (req.user){
		mailObj.subject += ' מ- ' + req.user.displayName;
		feedbackObj.userID = normalizeID(req.user._id);
	}

	sendMail(mailObj, function(err){
		if (err){
			log.error(err);

			return res.status(500).end();
		}

		res.status(200).end();
	});

}

function postTrack(req, res){

	if (!req.body.searchTerm) return res.status(400).end();

	// only send event if he's not app admin
	if (!req.user || !req.user.isAdmin()) req.track({ cat: 'search', label: 'group', input: req.body.searchTerm });

	res.status(200).end();
}