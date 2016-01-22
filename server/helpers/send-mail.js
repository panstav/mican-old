var log = require('../services/log');

var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill(process.env.MANDRILL_APIKEY);

var urls = require('./urls');

module.exports = function(settings, callback){

	log.trace(settings, 'Sending email');

	var emailTemplate = require('./templates.js')[settings.template](settings.templateArgs);
	var message = {
		important: settings.importance || false,

		from_email: urls.officialAddress,
		from_name: 'מכאן',
		to: [{ email: settings.recipient }],

		subject: settings.subject,
		html: emailTemplate
	};

	mandrill_client.messages.send({ message: message }, function() { callback() }, callback);

};