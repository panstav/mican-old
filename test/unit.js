'use strict';

const loadAngular = require('./load-angular');

const expect = require('expect.js');
const isHTML = require('is-html');

const db = require('../server/services/db');

const prettifyUrl = loadAngular(require('../client/src/common/functions/prettify-url.serv'), true);
const removeInvalidLinks = require('../server/helpers/remove-invalid-links');
const validMongoId = require('../server/helpers/valid-mongo-id');

describe('Unit', () => {

	describe('ParseTemplates', () => {

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

});

describe('Unit - PrettifyUrl', () => {

	it('Should remove http:// from url', done => {

		const url = 'http://example.com';
		expect(prettifyUrl(url)).to.be.eql('example.com');

		done();

	});

	it('Should remove http://www. from url', done => {

		const url = 'http://www.example.com';
		expect(prettifyUrl(url)).to.be.eql('example.com');

		done();

	});

	it('Should remove https:// from url', done => {

		const url = 'https://example.com';
		expect(prettifyUrl(url)).to.be.eql('example.com');

		done();

	});

	it('Should remove https://www. from url', done => {

		const url = 'https://www.example.com';
		expect(prettifyUrl(url)).to.be.eql('example.com');

		done();

	});

	it('Should keep ftp:// for example', done => {

		const url = 'ftp://www.example.com';
		expect(prettifyUrl(url)).to.be.eql('ftp://www.example.com');

		done();

	});

	it('Should keep example.com as is', done => {

		const url = 'example.com';
		expect(prettifyUrl(url)).to.be.eql('example.com');

		done();

	});



});

describe('Unit - RemoveInvalidLinks', () => {

	it('Should accept normal urls', done => {

		const urls = {
			a: 'http://www.example.com',
			b: 'https://www.another-example.co',
			c: 'http://www.something-else.io'
		};

		expect(removeInvalidLinks(urls)).to.be.eql(urls);
		expect(Object.keys(removeInvalidLinks(urls)).length).to.be.eql(Object.keys(urls).length);

		done();

	});

	it('Should forgive empty urls', done => {

		const urls = {
			a: 'http://www.example.com',
			b: ''
		};

		expect(removeInvalidLinks(urls)).to.be.eql(urls);
		expect(Object.keys(removeInvalidLinks(urls)).length).to.be.eql(Object.keys(urls).length);

		done();

	});

	it('Shouldn\'t accept bad urls', done => {

		const urls = {
			a: 'tp://www.example.com',
			b: 'https:www.another-example.co',
			c: 'ftp://www.something-else'
		};

		const validUrls = removeInvalidLinks(urls);

		expect(validUrls).to.not.be.eql(urls);
		expect(Object.keys(validUrls).length).to.not.be.eql(Object.keys(urls).length);

		done();

	});

	it('Should be able to handle hebrew seemlessly', done => {

		const urls = {
			a: 'http://www.example.com/למשל',
			b: 'https://www.another-example.co/דף-אחר/more/even-הרבה-יותר-more',
			c: 'http://www.something-else/עוד-עברית-and-english-too'
		};

		expect(removeInvalidLinks(urls)).to.be.eql(urls);
		expect(Object.keys(removeInvalidLinks(urls)).length).to.be.eql(Object.keys(urls).length);

		done();

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