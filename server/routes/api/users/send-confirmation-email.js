var log = require('../../../services/log');

var async = require('async');
var moment = require('moment');
var mandrill = require('mandrill-api/mandrill');

var mongoose = require('mongoose');
var userModel = mongoose.model('user');
var urls = require('../../../helpers/urls');

var guid = require('../../../helpers/guid');
var templates = require('../../../helpers/templates.js');

module.exports = function(req, res){

	async.waterfall(
		[

			make_sure_email_isnt_confirmed,

			send_confirmation_email,

			save_authcode_to_db

		]
	);

	function make_sure_email_isnt_confirmed(step){

		userModel.findById(req.user._id, function(err, userDoc){
			if (err){
				log.error(err);

				return res.status(500).end();
			}

			if (userDoc.confirmed.email.value === true) return res.status(403).end();

			step(null, userDoc);
		});

	}

	function send_confirmation_email(userDoc, step){

		var authCode = guid();
		var emailConfirmation = templates.emailConfirmation(authCode);

		var mandrill_client = new mandrill.Mandrill(process.env.MANDRILL_APIKEY);

		var message = {
				important: true,

				from_email: urls.officialAddress,
				from_name: 'דרכנו',
				to: [{ email: req.user.email }],

				subject: 'אישור שימוש בכתובת המייל',
				html: emailConfirmation
			};

		mandrill_client.messages.send({ message: message }, resume, function(err){
			log.error(err);

			return res.status(500).end();
		});

		function resume(){
			step(null, userDoc, authCode);
		}

	}

	function save_authcode_to_db(userDoc, authCode){

		// let user use this code for the next week
		userDoc.confirmed.email.code = authCode;
		userDoc.confirmed.email.timeframe = moment().add(7, 'days').format(config.timeformat);

		userDoc.save(function(err){
			if (err){
				log.error(err);

				return res.status(500).end();
			}

			res.status(200).end();
		});
	}

};