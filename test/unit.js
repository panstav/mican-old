'use strict';

const expect = require('expect.js');
const isHTML = require('is-html');

const db = require('../server/services/db');

const validMongoId = require('../server/helpers/valid-mongo-id');

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

describe('Unit - ValidMongoId', () => {

	it('Should reject all group namespaces', done => {

		db.models.group.find({}, 'namespace').exec().then(testAllNamespaces, done);

		function testAllNamespaces(docs){

			docs.forEach(doc => {
				expect(validMongoId(doc.namespace)).to.not.be.ok();
			});

			done();
		}

	});

});