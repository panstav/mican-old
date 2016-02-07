var log = require('../log');

var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill(process.env.MANDRILL_APIKEY);

var urls = require('./../../helpers/urls');
var parseTemplate = require('./parse-template');

module.exports = function(settings, callback){

	log.trace(settings, 'Sending email');

	var emailTemplate = parseTemplate(settings.template, settings.templateArgs);
	var message = {
		important: settings.importance || false,

		from_email: urls.officialAddress,
		from_name: 'מכאן',
		to: [{ email: settings.recipient }],

		subject: settings.subject,
		html: emailTemplate
	};

	if (process.env.NODE_ENV === 'test'){
		log.debug(`Avoided sending an email, with subject ${settings.subject}`);

		return callback();
	}

	mandrill_client.messages.send({ message: message }, function() { callback() }, callback);

};