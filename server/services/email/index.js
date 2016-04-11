const SparkPost = require('sparkpost');
const emailer = new SparkPost(process.env.SPARKPOST_API_KEY);

const log = require('../log');
const urls = require('./../../helpers/urls');
const parseTemplate = require('./parse-template');

module.exports = (settings, callback) => {

	log.trace(settings, 'Sending email');

	if (process.env.NODE_ENV === 'test'){
		log.debug(`Avoided sending an email, with subject ${settings.subject}`);

		return callback();
	}

	const transmissionBody = {
		recipients: [{ address: settings.recipient }],
		content: {
			from: { name: 'Mican מכאן', email: urls.officialAddress },
			reply_to: `Mican מכאן <${urls.officialAddress}>`,
			subject: settings.subject,
			html: parseTemplate(settings.template, settings.templateArgs)
		}
	};

	emailer.transmissions.send({ transmissionBody }, callback);

};