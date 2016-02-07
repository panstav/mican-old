var log = require('../../../services/log');

var async =       require('async');
var moment =      require('moment');

var mongoose =    require('mongoose');
var groupModel =  mongoose.model('group');
var userModel =   mongoose.model('user');

var sendMail =    require('../../../services/email');
var urls =        require('../../../helpers/urls');
var normalizeID = require('../../../helpers/normalize-id');
var paraSplit =   require('../../../helpers/para-split');

module.exports = (req, res, next) => {

	async.waterfall(
		[

			prep_and_save_new_groupObj,

			handle_groupField_suggestion,

			optionally_set_user_as_admin

		],

		function(err, results){
			if (err) return next(err);

			var resJson = results || {};

			resJson.groupCreated = true;

			res.status(200).json(resJson);
		}
	);

	function prep_and_save_new_groupObj(step){

		var newGroupObj = {
			createdAt: moment().unix(),

			admins: [],
			pending: !req.user.isAdmin(),

			displayName: req.body.displayName,
			desc: paraSplit(req.body.desc),
			color: req.body.color
		};

		if (req.body.amAdmin){
			newGroupObj.admins.push( req.user._id );
		}

		groupModel.create(newGroupObj, function(err, newGroupDoc){
			if (err) return log.error(err);

			var eventObj = {
				ec: 'Data Entry', ea: 'Group', dl: newGroupObj.displayName
			};

			if (process.env.NODE_ENV === 'production') req.track.event(eventObj).send();

			step(null, newGroupDoc);
		});

	}

	function handle_groupField_suggestion(newGroupDoc, step){

		var suggestedField = req.body.suggestedField;

		if (!suggestedField) return step(null, newGroupDoc);

		var mailObj = {
			subject: 'הצעה לזירת עשייה חדשה!',
			recipient: urls.supportAddress,
			importance: false,
			template: 'newFieldSuggestion',
			templateArgs: {
				groupID: normalizeID(newGroupDoc._id),
				groupDisplayName: newGroupDoc.displayName,
				userID: req.user ? normalizeID(req.user._id) : 'anon',
				suggestedField: suggestedField
			}
		};

		sendMail(mailObj, function(err){
			if (err) return log.error(err);

			step(null, newGroupDoc);
		});
	}

	function optionally_set_user_as_admin(newGroupDoc, step){

		// if user didn't ask for admin status over this group - then we're done here
		if (!req.body.amAdmin) return step();

		// otherwise register user as such admin
		userModel.findByIdAndUpdate(req.user._id, { $addToSet: { admining: normalizeID(newGroupDoc._id) }}, function(err){
			if (err) return log.error(err);

			// send the id so user could be redirected to newly created group profile
			step(null, { _id: normalizeID(newGroupDoc._id) });
		});
	}

};