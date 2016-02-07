'use strict';

var expect = require('expect.js');

var isHTML = require('is-html');

describe('Unit - ParseTemplates', () => {

	it('Should output valid HTML', () => {

		var args = {
			userID: '',
			useragent: '',
			opinion: {
				homepage: '',
				groups: '',
				volunteering: '',
				login: '',
				misc: ''
			},
			bug: '',
			idea: '',
			url: '',
			message: '',
			user: {
				email: ''
			},
			anon: {
				fullName: '',
				message: '',
				contact: {
					value: ''
				}
			},
			taskTitle: '',
			taskLink: '',
			groupTitle: '',
			groupLink: '',
			groupDisplayName: ''
		};

		let parseTemplates = require('../server/services/email/parse-template');

		parseTemplates.templateNames.forEach(templateName => {

			let output = parseTemplates(templateName, args);
			expect(isHTML(output)).to.be.ok();

		});

	});

});